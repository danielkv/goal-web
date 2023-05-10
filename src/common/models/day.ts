import { IBlock, IRound } from './block'

export type ISection = {
    name: string
    blocks: IBlock[]
}

export type IPeriod = {
    name?: string
    sections: ISection[]
}

export type IDay = {
    name: string
    date: string // YYYY-MM-DD
    periods: IPeriod[]
}

export type IWorksheet = {
    id?: string
    name: string
    info?: string
    startDate: string // YYYY-MM-DD
    days: IDay[]
}

export type TPeaces = IDay | IPeriod | ISection | IBlock | IRound

export type IWorksheetModel = Omit<IWorksheet, 'id'> & { id: string }
