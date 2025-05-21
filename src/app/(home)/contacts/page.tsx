"use client"

import { ColDef } from "ag-grid-community";
import { ActionBtn, CommonListComponent, DateForamate, filterStatusOptions, paginationsOptions } from "../../../components/list.component";
import { ROUTE } from "../../../utils/axios/routes";
import { memo } from "react";
import { COMMON_LIST_COMPONENT_INTERFACE } from "../../../utils/general/interface";
import Link from "next/link";
import Image from "next/image";

export default function ContactsPage() {
    const commonInput: COMMON_LIST_COMPONENT_INTERFACE = {
        "name": "Contacts",
        "description": "Contacts page",
        "colDefs": [
            {
                "headerName": "Image",
                "field": "image",
                "sortable": false,
                "width": 352,
                "cellRenderer": (prop) => {
                    return <img src={prop.value} alt={prop.data.name}/>
                }
            },
            {
                "headerName": "Name",
                "field": "name",
                "sortable": true,
                "width": 352,
                "cellRenderer": (prop) => {
                    return <Link href={`/contacts/${prop.data.id}`}>{prop.value}</Link>
                }
            },
            {
                "headerName": "Phone Number",
                "field": "phone_number",
                "sortable": true,
                "width": 352,
            },
            {
                "headerName": "Status",
                "field": "status",
                "sortable": true,
                "width": 352
            },
            {
                "headerName": "Add Date",
                "field": "adt",
                "cellRenderer": DateForamate,
                "cellRendererParams": {
                    "dateFormate": "MM/dd/yyyy hh:mm a"
                },
                "sortable": true,
                "width": 352
            },
            {
                "headerName": "Action",
                "cellRenderer": ActionBtn,
                "sortable": false,
                "width": 100
            }
        ],

        "default_col_def": {
            "flex": 1,
            "cellClass": "ag-cell-value-center",
            "headerClass": "ag-header-cell-label-center",
            "editable": true,
            "cellEditor": false

        },
        "api_url": {
            "add": ROUTE.CONTACTS.CREATE,
            "update": ROUTE.CONTACTS.UPDATE,
            "list": ROUTE.CONTACTS.LIST,
            "details": ROUTE.CONTACTS.DETAILS,
            "delete": ROUTE.CONTACTS.DELETE,
            "status": ROUTE.CONTACTS.STATUS,
        },
        "actions": {
            "add": true,
            "update": true,
            "list": true,
            "delete": true,
            "refresh": true,
            "status": true,
            "pagination": true,
            "search": true,
            "sort": true
        },
        "actions_options": {
            "pagination_options": paginationsOptions,
            "filter_status_options": filterStatusOptions
        },
        "add_update_actions": {
            "add": {
                "redirect": true,
                "pop_up": false,
                "redirect_url": "/contacts/create"
            },
            "update": {
                "redirect": true,
                "pop_up": false
            }

        }

    }

    return <CommonListComponent {...commonInput} />
}