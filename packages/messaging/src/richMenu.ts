import { lineRequest } from "./client.js";

interface RichMenuArea {
    bounds: { x: number; y: number; width: number; height: number };
    action: { type: string;[key: string]: any };
}

interface RichMenu {
    size: { width: number; height: number };
    selected: boolean;
    name: string;
    chatBarText: string;
    areas: RichMenuArea[];
}

export const richMenu = {
    create: (token: string, richMenu: RichMenu) =>
        lineRequest(token, "POST", "/richmenu", richMenu),

    delete: (token: string, richMenuId: string) =>
        lineRequest(token, "DELETE", `/richmenu/${richMenuId}`),

    get: (token: string, richMenuId: string) =>
        lineRequest(token, "GET", `/richmenu/${richMenuId}`),

    setDefault: (token: string, richMenuId: string) =>
        lineRequest(token, "POST", `/user/all/richmenu/${richMenuId}`),

    linkUser: (token: string, userId: string, richMenuId: string) =>
        lineRequest(token, "POST", `/user/${userId}/richmenu/${richMenuId}`),

    unlinkUser: (token: string, userId: string) =>
        lineRequest(token, "DELETE", `/user/${userId}/richmenu`),
};
