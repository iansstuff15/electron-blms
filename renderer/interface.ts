
import { BaseOptionType, DefaultOptionType } from 'antd/es/select';
import type { ColumnsType } from 'antd/es/table';
import { DocumentData, FieldValue } from 'firebase/firestore';
import { Dispatch, ReactNode, SetStateAction } from "react";

export interface LayoutProps{
    children: ReactNode,
    location: string
}

export interface AddDataProps{

    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    onSubmit: VoidFunction,
    deliveryNumber?: string | number
    deliveryDetails?: {
        deliveryNumber:string
        dateAcquired: string
        DRDate: string
        IARNumber: string
        deliveryRecieptNumber: string
        assetCategory:string
        assetClassification:string
        salesInvoiceNumber:number
        item: string
        brandAndModel: string
        storageRoom: string
        nameOfSupplier: string
        contactNumber:number
        condition:string
        modeOfAcquisition: string
        quantity: number
        unitCost:number
        timeStamp: FieldValue
    } | DocumentData
    issuanceDetails?: {
        deliveryNumber:string
        date: string
        ICSNumber: string
        propertyNumber:string
        quantity:number
        remarks:string
        office:string
        position: string
        personAccountable:string
        endUser:string
        serialNumber:string
        timeStamp: FieldValue
    } | DocumentData

    inputData: Array<{
        type: string;
              label: string;
              placeholder?: string;
              state: string | number | boolean | Date;
              setState: React.Dispatch<React.SetStateAction<string | number | boolean | string[]>>;
              options?: Option[];
              optionSetState?: Array<React.Dispatch<React.SetStateAction<string>>>;
              selectOption?: (BaseOptionType | DefaultOptionType)[];
              multiple?: boolean;
              rules?: {
                required?: boolean;
                len?: number;
                min?: number;
              };
    }>

}

export interface SidebarProps{
    highlight: string
}

export interface DataType {
    key: React.Key,
    name: string,
    age: number,
    address: string,
   
  }
interface Positions{
    key: React.Key,
    id:string,
    name: string
}
interface Office{
    key: React.Key,
    id:string,
    name: string
}
interface Supplier{
    key: React.Key,
    id:string,
    name: string
    address: string
}

export interface Employee{
    key: React.Key,
    id:string,
    uid?:string,
    firstName: string,
    lastName: string,
    middleName: string,
    emai: string,
    office:string,
    position:string,
}
interface Assets{

}

interface Classifications{
    key: React.Key,
    id: string,
    code:string,
    description:string,
    GL_SL: string,
    IASCSCode:string,
    estimatedLifeSpan: number,
    name: string,
}
export interface Option {
    value: string | number;
    label: string;
    children?: Array<Option>;
  }
export interface AppTableProps{
    data?:  Positions[] | Office[] | Supplier[] | Employee[] | Assets[] | Classifications[],
    width?: string
    deliveryNumber?: string | number
    specialAction?:Array< {
        label:string
        onClick:()=>void
        confirm: boolean
    }>
    columns?:ColumnsType<Assets>
    onSubmit: VoidFunction,
    updateInputData?:Array<{
        type:string,
        state?: string | number | boolean ,
        setState?: Dispatch<SetStateAction<string>> | Dispatch<SetStateAction<number>> | Dispatch<SetStateAction<boolean>>,
        placeholder?:string,
        defaultValue?: string | number ,
        label:string,
        options?:Array<{
            label?:string,
            value?:string
        }>
    }>,
    deliveryDetails?: {
        deliveryNumber:string
        dateAcquired: string
        DRDate: string
        IARNumber: string
        deliveryRecieptNumber: string
        assetCategory:string
        assetClassification:string
        salesInvoiceNumber:number
        item: string
        brandAndModel: string
        storageRoom: string
        nameOfSupplier: string
        contactNumber:number
        condition:string
        modeOfAcquisition: string
        quantity: number
        unitCost:number
        timeStamp: FieldValue
    } | DocumentData


    issuanceDetails?: {
        deliveryNumber:string
        date: string
        ICSNumber: string
        propertyNumber:string
        quantity:number
        remarks:string
        office:string
        position: string
        personAccountable:string
        endUser:string
        serialNumber:string
        timeStamp: FieldValue
    } | DocumentData


    onUpdate: VoidFunction,
    inputData?: Array<{
        type: string;
        label: string;
        placeholder?: string;
        state?: string | number | boolean | Date | string[];
        setState?: Function;
        options?: Option[];
        optionSetState?: Array<React.Dispatch<React.SetStateAction<string>>>;
        selectOption?: (BaseOptionType | DefaultOptionType)[];
        multiple?: boolean;
        rules?: {
          required?: boolean;
          len?: number;
          min?: number;
        };
    }>

}

export interface Delivery{
    deliveryNumber: number,
    dateAcquired: Date,
    DRDate: Date,
    deliveryReceiptNumber: number,
    assetCategory: string,
    item:string,
    brandAndModel: string,
    assetClassification: string,
    storageRoom:string,
    salesInvoiceNumber: number,
    nameOfSupplier:string,
    contactNumber: number,
    condition:string,
    modeOfAcquisition:string,
    quantity: number,
    unitCost:number,
    totalCost:number,
}

