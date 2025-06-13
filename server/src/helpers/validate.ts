export function getRequestType(body: any): 'adw' | 'campaign' | 'unknown' {
    if ('adw_id' in body) return 'adw';
    if ('campaign_global_id' in body) return 'campaign';
    return 'unknown';
}

export function validateDynamicLinksRequest(body: any): { type: string, success: boolean, missing: string[] } {
    const baseRequiredFields = ['channel_offer', 'title', 'keywords', 'img'];

    const adwRequired = ['adw_id'];
    const campaignRequired = ['campaign_global_id', 'team_id', 'team_user_id', 'ubi_user_id'];

    const type = getRequestType(body);

    let requiredFields: string[] = [];
    if (type === 'adw') requiredFields = [...baseRequiredFields, ...adwRequired];
    else if (type === 'campaign') requiredFields = [...baseRequiredFields, ...campaignRequired];
    else return { type: 'unknown', success: false, missing: ['Could not determine request type'] };

    const missing = requiredFields.filter(field => !body[field]);

    return {
        type,
        success: missing.length === 0,
        missing,
    };
}

export const MODEL_TOKEN = "MODEL_TOKEN";
