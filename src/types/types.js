const ROLES = Object.freeze({
    ADMIN: 'ADMIN',
    USER: 'USER',
});

const REF = Object.freeze({
    COURSE: 'Course',
    ADMIN: 'Admin',
    USER: 'User',
    ACTIVITY: 'Activity',
    BLOG: 'Blog',
    PURCHASE: 'Purchase',
    MODULE: 'Module',
});

const TYPEMODULE = Object.freeze({
    ASINCRONICO: 'asincronico',
    SINCRONICO: 'sincronico',
});

const TYPETOPAY = Object.freeze({
    MP: 'mercado-pago',
    PP: 'paypal',
    TRANS: 'transferencia',
});

module.exports = {
    ROLES,
    REF,
    TYPEMODULE,
    TYPETOPAY,
};