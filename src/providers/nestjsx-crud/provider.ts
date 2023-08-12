import { DataProvider, HttpError } from "@refinedev/core";
import {
  handleFilter,
  handlePagination,
  handleSort,
  handleJoin,
  axiosInstance,
  transformHttpError,
} from "./utils";
import { RequestQueryBuilder, CondOperator } from "@nestjsx/crud-request";
import { AxiosInstance } from "axios";
import { stringify } from "query-string";

export const dataProvider = (
  apiUrl: string,
  httpClient: AxiosInstance = axiosInstance
): Required<DataProvider> => ({
  getList: async ({ resource, pagination, filters, sorters, meta }) => {
    const url = `${apiUrl}/${resource}`;

    let query = RequestQueryBuilder.create();

    query = handleFilter(query, filters);
    query = handleJoin(query, meta?.join);
    query = handlePagination(query, pagination);
    query = handleSort(query, sorters);

    const { data } = await httpClient.get(`${url}?${query.query()}`);

    // without pagination
    if (Array.isArray(data)) {
      return {
        data,
        total: data.length,
      };
    } else {
      // with pagination
      return {
        data: data.data,
        total: data.total,
      };
    }
  },

  getMany: async ({ resource, ids, meta }) => {
    const url = `${apiUrl}/${resource}`;

    let query = RequestQueryBuilder.create().setFilter({
      field: "id",
      operator: CondOperator.IN,
      value: ids,
    });

    query = handleJoin(query, meta?.join);

    const { data } = await httpClient.get(`${url}?${query.query()}`);

    return {
      data,
    };
  },

  create: async ({ resource, variables }) => {
    const url = `${apiUrl}/${resource}`;

    try {
      const { data } = await httpClient.post(url, variables);

      return {
        data,
      };
    } catch (error) {
      const httpError = transformHttpError(error);

      throw httpError;
    }
  },

  update: async ({ resource, id, variables }) => {
    const url = `${apiUrl}/${resource}/${id}`;

    try {
      const { data } = await httpClient.patch(url, variables);

      return {
        data,
      };
    } catch (error) {
      const httpError = transformHttpError(error);

      throw httpError;
    }
  },

  updateMany: async ({ resource, ids, variables }) => {
    const errors: HttpError[] = [];

    const response = await Promise.all(
      ids.map(async (id) => {
        try {
          const { data } = await httpClient.patch(
            `${apiUrl}/${resource}/${id}`,
            variables
          );
          return data;
        } catch (error) {
          const httpError = transformHttpError(error);

          errors.push(httpError);
        }
      })
    );

    if (errors.length > 0) {
      throw errors;
    }

    return { data: response };
  },

  createMany: async ({ resource, variables }) => {
    const url = `${apiUrl}/${resource}/bulk`;

    try {
      const { data } = await httpClient.post(url, { bulk: variables });

      return {
        data,
      };
    } catch (error) {
      const httpError = transformHttpError(error);

      throw httpError;
    }
  },

  getOne: async ({ resource, id }) => {
    const url = `${apiUrl}/${resource}/${id}`;

    const { data } = await httpClient.get(url);

    return {
      data,
    };
  },

  deleteOne: async ({ resource, id }) => {
    const url = `${apiUrl}/${resource}/${id}`;

    const { data } = await httpClient.delete(url);

    return {
      data,
    };
  },

  deleteMany: async ({ resource, ids }) => {
    const response = await Promise.all(
      ids.map(async (id) => {
        const { data } = await httpClient.delete(`${apiUrl}/${resource}/${id}`);
        return data;
      })
    );
    return { data: response };
  },

  getApiUrl: () => {
    return apiUrl;
  },

  custom: async ({
    url,
    method,
    meta,
    filters,
    sorters,
    payload,
    query,
    headers,
  }) => {
    let requestQueryBuilder = RequestQueryBuilder.create();

    requestQueryBuilder = handleFilter(requestQueryBuilder, filters);

    requestQueryBuilder = handleJoin(requestQueryBuilder, meta?.join);

    requestQueryBuilder = handleSort(requestQueryBuilder, sorters);

    let requestUrl = `${url}?${requestQueryBuilder.query()}`;

    if (query) {
      requestUrl = `${requestUrl}&${stringify(query)}`;
    }

    if (headers) {
      httpClient.defaults.headers = {
        ...httpClient.defaults.headers,
        ...headers,
      };
    }

    let axiosResponse;
    switch (method) {
      case "put":
      case "post":
      case "patch":
        axiosResponse = await httpClient[method](url, payload);
        break;
      case "delete":
        axiosResponse = await httpClient.delete(url, {
          data: payload,
        });
        break;
      default:
        axiosResponse = await httpClient.get(requestUrl);
        break;
    }

    const { data } = axiosResponse;

    return Promise.resolve({ data });
  },
});
