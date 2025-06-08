import { DataSource, Repository } from "typeorm";
import { Links } from "../entity/LinkModel";
import { inject, injectable, container } from 'tsyringe'
import slugify from "slugify";
import path from "path";
import fs from 'fs';
import { LinksMultilang } from "../entity/LinksMultilang";

@injectable()
export class LinksService {
    protected LinksRepo: Repository<Links>;
    protected LinksMultilangRepo: Repository<LinksMultilang>

    constructor(@inject("AppDataSource") private datasource: DataSource) {
        this.LinksRepo = datasource.getRepository(Links);
        this.LinksMultilangRepo = datasource.getRepository(LinksMultilang);
    }

    async create(data: Partial<Links>, request_type: string) {
        let optional_params = [
            'postback',
            'pixel_id',
            'pixel_token',
            'pixel_event',
            'multilang'
        ]
        try {
            const optional_fields = Object.fromEntries(
                Object.entries(data).filter(([key]) => optional_params.includes(key))
            );

            let prepared_data: Partial<Links> = {}
            let find_link = null
            if (request_type === 'adw') {
                // required fields
                prepared_data = {
                    adw_id: data?.adw_id,
                    channel_offer: data?.channel_offer,
                    title: data?.title,
                    keywords: JSON.stringify(data?.keywords),
                    img: data?.img,
                }
                find_link = await this.LinksRepo.findOneBy({
                    adw_id: data?.adw_id
                })
                if (find_link) {
                    return { success: 0, error: "Link with this adw id is already existed" }
                }
            } else if (request_type === 'campaign') {
                // required fields
                prepared_data = {
                    campaign_global_id: data?.campaign_global_id,
                    team_id: data?.team_id,
                    team_user_id: data?.team_user_id,
                    ubi_user_id: data?.ubi_user_id,
                    channel_offer: data?.channel_offer,
                    title: data?.title,
                    keywords: JSON.stringify(data?.keywords),
                    img: data?.img
                }
                find_link = await this.LinksRepo.findOneBy({
                    campaign_global_id: data?.campaign_global_id
                })
                if (find_link) {
                    return { success: 0, error: "Link with this credentials is already exists" }
                }
            } else {
                return { success: 0, error: "Unknown type of link" };
            }

            prepared_data = {
                ...prepared_data,
                ...optional_fields
            }
            const name = slugify(prepared_data?.title || '', {
                locale: 'en',
                replacement: '_',
                lower: true,
                strict: true
            })
            prepared_data.name = name;
            prepared_data.domain = 'example.com'
            prepared_data.title_white = ''
            prepared_data.description = ''
            prepared_data.description_white = ''
            prepared_data.sub_description = ''
            prepared_data.keywords_white = ''


            const _link = await this.LinksRepo.create({ ...prepared_data })
            _link.time_create = Math.floor(Date.now() / 1000);

            const _l = await this.LinksRepo.save(_link)
            console.log("link, link to response", _l,)

            const urlParam = new URLSearchParams({ creative: prepared_data?.title || '' }).toString();
            const generated_link = `https://${_l.domain}/blog/${_l.id}-${_l.name}?${urlParam}`;
            return { success: 1, link: generated_link, id: _l.id, title: _l.title }
        }
        catch (err) {
            console.error("Error while creating a link", err)
            return null
        }

    }
    async update(data: Partial<Links>) {
        try {
            let params = [
                'title',
                'keywords',
                'postback',
                'pixel_id',
                'pixel_token',
                'pixel_event',
                'img'
            ]
            let _l = null

            if (data.adw_id) {
                _l = await this.LinksRepo.findOneBy({
                    adw_id: data.adw_id
                })
                if (!_l) {
                    return { success: 0, error: "Link with this adw id is not existed" }
                }
            }
            else if (data.campaign_global_id) {
                _l = await this.LinksRepo.findOneBy({
                    campaign_global_id: data.campaign_global_id
                })
            }
            else {
                return { success: 0, error: "Id is not provided" }
            }

            if (!_l) {
                return { success: 0, error: "Links does not exists" }
            }

            delete data['adw_id']
            delete data['campaign_global_id']

            data = Object.fromEntries(
                Object.entries(data).filter(([key]) => params.includes(key))
            );

            if (data?.img) {
                const filepath = path.join(__dirname, '../..', _l.img)
                fs.unlink(filepath, (unlinkErr) => {
                    if (unlinkErr) {
                        console.error("Error while deleting file", unlinkErr)
                    }
                })
            }
            if (data?.title) {
                _l.name = slugify(data?.title || '', {
                    locale: 'en',
                    replacement: '_',
                    lower: true,
                    strict: true
                })
            }
            Object.assign(_l, data)
            const saved = await this.LinksRepo.save(_l);

            const urlParam = new URLSearchParams({ creative: saved?.title || '' }).toString();
            const generated_link = `https://${_l.domain}/blog/${_l.id}-${_l.name}?${urlParam}`;
            return { success: 1, link: generated_link }

        } catch (error) {
            console.error("Error while updating link", error)

        }
    }

    async findByUrl(data: Partial<any>, language?: string | '') {
        try {
            const _l = await this.LinksRepo.findOneBy({
                name: data?.name,
                id: data?.id,
            })
            if (!_l) {
                return { ok: 0, error: "Could not found this link" }
            }
            if (!_l.multilang) {
                return {
                    ok: 1, data: {
                        title: _l?.title_white,
                        description: _l?.description_white,
                        language: _l?.lang
                    }
                }
            }

            if (_l.lang === language || language === '') { }
            else {
                const _multi_l = await this.LinksMultilangRepo.findOne({
                    where: {
                        link_id: _l.id,
                        lang: language
                    }
                })
                if (_multi_l) {
                    return {
                        ok: 1, data: {
                            title: _multi_l?.status ? _multi_l?.title : _l.title,
                            description: _multi_l?.status ? _multi_l?.description : _l.description,
                            language: _multi_l?.status ? _multi_l?.lang : _l.lang
                        }
                    }
                } else {
                    // return json to translate
                    const link_multilang = await this.LinksMultilangRepo.create({
                        status: 0,
                        link_id: _l.id,
                        lang: language
                    })
                    const saved = await this.LinksMultilangRepo.save(link_multilang);
                    console.log("link_multilang", link_multilang, saved)
                    return {
                        translate: 1, lang: language, id: _l.id,
                        data: {
                            title: _l?.title_white,
                            description: _l?.description_white,
                            language: _l?.lang
                        },
                        payload: {
                            title_ai: _l.title_white,
                            description_ai: _l.description_white,
                            sub_description_ai: _l.sub_description,
                            keywords_ai: _l.keywords,
                            from_lang: _l.lang,
                            to_lang: language
                        }
                    }
                }
            }

            return {
                ok: 1, data: {
                    title: _l?.title_white,
                    description: _l?.description_white,
                    language: _l?.lang
                }
            }
        }
        catch (err) {
            return { ok: 0, error: err }
        }
    }

    async addGeneratedContent(link_id: number, prompt_payload: Partial<any>) {
        const cut_parts = this.cutLinkParts(prompt_payload?.text || '')
        try {
            const _l = await this.LinksRepo.findOneBy({
                id: link_id
            })
            if (_l) {

                _l.lang = cut_parts['lang'] || null
                _l.keywords_white = cut_parts['keywords'] || ''
                _l.description = cut_parts['description'] || ''
                _l.description_white = cut_parts['description'] || ''
                _l.sub_description = cut_parts['sub_description'] || ''
                _l.title_white = cut_parts['title'] || ''
                _l.status = 1;

                await this.LinksRepo.save(_l)
                return { success: 1, message: "Generate content successfully" }
            } else {
                return { success: 0, error: "Link by this id is not exists" }
            }
        }
        catch (err) {
            console.error("Error while updating link", err)
            return { success: 0, error: err }
        }
    }

    async addTraslatedLink(id: number, prompt_payload: any, lang: string) {
        const cut_parts = this.cutLinkParts(prompt_payload?.text || '')
        try {
            const _l = await this.LinksMultilangRepo.findOneBy({
                link_id: id,
                lang: lang
            })

            if (_l) {
                _l.title =  cut_parts['title'] || ''
                _l.description =  cut_parts['description'] || ''
                _l.sub_description =  cut_parts['description'] || ''
                _l.keywords =  cut_parts['keywords'] || ''
                _l.status =  1
                
                const saved = await this.LinksMultilangRepo.save(_l)
                 return { ok: 1, message: "Generate content successfully" }
            }else {
                return { ok: 0, error: "This multilanguage link does not exists" }
            }

        } catch (err) {
            console.error("Error while create lang link", err)
            return { ok: 0, error: err }
        }

    }

    private cutLinkParts(text: string) {
        let match;
        let answer: Partial<any> = {}

        match = text.match(/#lang_start#([\s\S]*?)#lang_end#/)
        if (match) {
            answer['lang'] = match[1].trim()
        }

        match = text.match(/#title_start#([\s\S]*?)#title_end#/)
        if (match) {
            answer['title'] = match[1].trim()
        }

        match = text.match(/#description_start_text_start#([\s\S]*?)#description_start_text_end#/)
        if (match) {
            answer['description_start_text'] = match[1].trim()
        }
        match = text.match(/#description_start#([\s\S]*?)#description_end#/)
        if (match) {
            answer['description'] = match[1].trim()
        }
        match = text.match(/#summary_start#([\s\S]*?)#summary_end#/)
        if (match) {
            answer['summary'] = match[1].trim()
        }
        match = text.match(/#keywords_start#([\s\S]*?)#keywords_end#/)
        if (match) {
            answer['keywords'] = JSON.stringify(match[1].trim().split(','))
        }

        if (answer['description'] && answer['summary']) {
            answer['sub_description'] = answer['description'].concat(answer['summary'])
        }
        return answer
    }
}
