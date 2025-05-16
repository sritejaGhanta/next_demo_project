"use client"

import { ColDef } from "ag-grid-community";
import { ActionBtn, CommonListComponent, DateForamate } from "../../../components/list.component";
import { ROUTE } from "../../../utils/axios/routes";
import { memo } from "react";

export default function ContactsPage() {
    const colDefs: ColDef[] = [
        {
            headerName: "Name",
            field: "name",
            sortable: true,
            width: 352,
        },
        {
            headerName: "Phone Number",
            field: "phone_number",
            sortable: true,
            width: 352,
        },
        {
            headerName: "Status",
            field: "status",
            sortable: true,
            width: 352
        },
        {
            headerName: "Add Date",
            field: "adt",
            cellRenderer: DateForamate,
            cellRendererParams: {
                dateFormate: "MM/dd/yyyy hh:mm a"
            },
            sortable: true,
            width: 352
        },
        {
            headerName: "Action",
            cellRenderer: ActionBtn,
            sortable: true,
            width: 100
        }
    ];

    const defaultColDef = {
        flex: 1,
        cellClass: "ag-cell-value-center",
        headerClass: "ag-header-cell-label-center",
        editable: true,
        cellEditor: false

    };
    const apiUrls = {
        add: ROUTE.CONTACTS.CREATE,
        update: ROUTE.CONTACTS.UPDATE,
        list: ROUTE.CONTACTS.LIST,
        details: ROUTE.CONTACTS.DETAILS,
        delete: ROUTE.CONTACTS.DELETE,
        status: ROUTE.CONTACTS.STATUS
    }
    const actions = {
        add: true,
        update: true,
        list: true,
        delete: true,
        refresh: true,
        status: true,
        pagination: true,
        search: true
    }

    return <>
        <CommonListComponent
            colDefs={colDefs}
            defaultColDef={defaultColDef}
            api_url={apiUrls}
            actions={actions}
            row_selction={"multiRow"}
        />
    </>
}