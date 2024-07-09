import firebase from 'firebase/compat/app'

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

type User = {
    name: string
    email: string
    birthday: string
}

type FormToShow = 'login' | 'signup' | 'none'