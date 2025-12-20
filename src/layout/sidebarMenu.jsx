export const SIDEBAR_MENU = [
    {
        title: "Master",
        roles: ["ADMIN", "OWNER"],
        items: [
            { to: "/master/zone", label: "Zone" },
            { to: "/master/rack", label: "Rack" },
            { to: "/master/location", label: "Location" }
        ]
    },
    {
        title: "재고 / 작업",
        roles: ["ADMIN", "OWNER", "CENTER"],
        items: [
            { to: "/stock/status", label: "재고현황" }
        ]
    }
];