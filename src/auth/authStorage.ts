const ACCESS = 'pt_access'
const REFRESH = 'pt_refresh'
const ROLE = 'pt_role'

export const authStorage = {
    getAccess: () => localStorage.getItem(ACCESS) || '',
    getRefresh: () => localStorage.getItem(REFRESH) || '',
    getRole: () => (localStorage.getItem(ROLE) || '') as any,
    set: (access: string, refresh: string, role?: string) => {
        localStorage.setItem(ACCESS, access)
        localStorage.setItem(REFRESH, refresh)
        if (role) localStorage.setItem(ROLE, role)
    },
    clear: () => {
        localStorage.removeItem(ACCESS)
        localStorage.removeItem(REFRESH)
        localStorage.removeItem(ROLE)
    }
}
