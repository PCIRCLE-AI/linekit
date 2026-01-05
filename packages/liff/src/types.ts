export interface LiffView {
    type: "compact" | "tall" | "full";
    url: string;
    moduleMode?: boolean;
    description?: string;
    features?: {
        ble?: boolean;
        qrCode?: boolean;
    };
    permanentLinkPattern?: "concat" | "default" | "replace";
}

export interface LiffApp extends LiffView {
    liffId: string;
}

export interface CreateLiffAppRequest {
    view: LiffView;
}

export interface UpdateLiffAppRequest {
    view: LiffView;
}

export interface LiffAppsResponse {
    apps: LiffApp[];
}
