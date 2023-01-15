export enum APIHttpStatusCode {
  OK = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  SERVER_ERROR = 500,
}

export class ResponseBuilder {
  static buildLinks(url: string, limit: number, offset: number, count: number): APIPaginationLinks {
    const totalPages = Math.ceil(count / limit);

    const links: APIPaginationLinks = {
      self: `${url}?limit=${limit}&offset=${offset}`,
      first: `${url}?limit=${limit}&offset=0`,
      last: `${url}?limit=${limit}&offset=${(totalPages - 1) * limit}`,
      next: null,
      previous: null,
    };

    if (offset + limit < count) {
      links.next = `${url}?limit=${limit}&offset=${offset + limit}`;
    }

    if (offset - limit >= 0) {
      links.previous = `${url}?limit=${limit}&offset=${offset - limit}`;
    }

    return links;
  }

  static success(data: object | void, meta = null, links = null): APIResponse {
    const responseBody = {
      status: 'OK',
      ...(data ? { data } : {}),
      ...(meta ? { meta } : {}),
      ...(links ? { links } : {}),
    };

    const response = {
      statusCode: APIHttpStatusCode.OK,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(responseBody),
    };

    return response;
  }

  static error(statusCode: APIHttpStatusCode, error: object | string): APIResponse {
    const response = {
      statusCode,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        status: 'ERROR',
        error,
      }),
    };

    return response;
  }
}
