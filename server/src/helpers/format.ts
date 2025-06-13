import dayjs from "dayjs";

export function format_seconds_timestamp(timestamp: number, format: string) {
  return dayjs.unix(timestamp).format(format);
}

export function isStringifiedArray(str: string, re: number = 0) {
  try {
    const parsed = JSON.parse(str);
    const parserdIf = Array.isArray(parsed);
    if (!parserdIf) {
      throw "Parse error"
    }
    return re ? parsed : parserdIf
  } catch (e) {
    return false;
  }
}

export function normalizeTags(tags: string): string[] {
  return tags
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0); 
}

export function cutThePrompt(isLink: boolean, isLinkTranslate: boolean, text: string) {
  let match;
  let answer: Partial<any> = {}
  if (isLinkTranslate) {
      match = text.match(/#title_start#([\s\S]*?)#title_end#/)
      if (match) {
        answer['title'] = match[1].trim()
      }

      match = text.match(/#description_start#([\s\S]*?)#description_end#/)
      if (match) {
        answer['description'] = match[1].trim()
      }
      
      match = text.match(/#sub_description_start#([\s\S]*?)#sub_description_end#/)
      if (match) {
        answer['sub_description'] = match[1].trim()
      }
      
      match = text.match(/#keywords_start#([\s\S]*?)#keywords_end#/)
      if (match) {
        answer['keywords'] = match[1].trim()
      }

  } else {
    if (isLink) {
      match = text.match(/#lang_start#([\s\S]*?)#lang_end#/)
      if (match) {
        answer['lang'] = match[1].trim()
      }

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
  }

  return answer
}
