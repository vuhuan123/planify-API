import { env } from '~/config/environment'
// nhuwng tai nguyen dc phep truy cap
export const WHITELIST_DOMAINS = [
    'http://localhost:5173',
    'http://localhost:5174'

]

export const WEBSITE_DOMAIN = (env.BUILD_MODE === 'production') ? env.WEBSITE_DOMAIN_PROD : env.WEBSITE_DOMAIN_DEV

export const DEFAULT_PAGE = 1
export const DEFAULT_ITEMS_PER_PAGE = 12

export const INITATION_TYPES = {
    BOARD_INVITATION : 'BOARD_INVITATION'
}

export const BOARD_INVITATION_STATUS = {
    PENDING: 'PENDING',
    ACCEPTED:  'ACCEPTED',
    REJECTED : 'REJECTED'
}