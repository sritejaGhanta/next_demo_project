"use client"
import React from 'react'
import { memo, StrictMode, useCallback, useEffect, useMemo, useState } from "react";
import { API_RESPONSE, COMMON_LIST_COMPONENT_INTERFACE } from "../utils/general/interface";
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, CheckboxEditorModule, ClientSideRowModelModule, ColDef, DateEditorModule, DateFilterModule, IDateFilterParams, ModuleRegistry, NumberEditorModule, NumberFilterModule, provideGlobalGridOptions, RowSelectionModule, RowSelectionOptions, TextEditorModule, TextFilterModule, themeAlpine, themeBalham, themeQuartz, ValidationModule } from 'ag-grid-community';
import { Axios } from "../utils/axios/service";
import { toast } from "react-toastify";
import { format } from "date-fns";
import Select from 'react-select'
import { useDebouncedCallback } from 'use-debounce';


ModuleRegistry.registerModules([
    AllCommunityModule,
    CheckboxEditorModule,
    NumberEditorModule,
    NumberFilterModule,
    DateFilterModule,
    DateEditorModule,
    ClientSideRowModelModule,
    ClientSideRowModelModule,
    RowSelectionModule,
    // CellSelectionModule
]);

provideGlobalGridOptions({
    theme: "legacy",
});

let Grid:any;

function CommonList(prop: COMMON_LIST_COMPONENT_INTERFACE) {
    const myTheme = themeAlpine || themeBalham;
    const [rowData, setRowData] = useState([]);
    const [status, setStatus] = useState(null);
    const [keyword, setKeyword] = useState(null);
    const [grid, setGrid] = useState(null)

    const callApi = useCallback(async () => {
        const filters: any = {};
        if (status) {
            filters.status = status;
        }

        if (keyword) {
            filters.keyword = keyword
        }

        Axios.post(prop.api_url.list, filters).then((res: API_RESPONSE) => {
            if (!res?.settings?.success) {
                toast.error(res?.settings?.message || "Something went wrong please try again.");
            } else {
                toast.success(res.settings.message);
                setRowData(res.data);
            }
        })
    }, [status, keyword]);


    // Grid is Ready
    const onGridReady = (grid) => {
        setGrid(grid)
    }

    // select multiple rows
    const rowSelection: RowSelectionOptions = useMemo(() => {
        return {
            mode: 'multiRow',
        };
    }, []);

    const cellSelection = useMemo(() => {
        return {
            enableHeaderHighlight: true,
        };
    }, []);

    // Detect keywod changes
    const keyDebouncer = useDebouncedCallback(
        // function
        (value) => {
            setKeyword(value);
        },
        // delay in 1s
        1000
    );
    const clearKeyword = () => {
        document.getElementById('searchKeyowrd').value = null;
        setKeyword(null)
    }

    // Change Status
    const changeStatus = async (status) => {
        const selectedRows = Grid?.getSelectedRows() || [];
        const ids = selectedRows.map(e => e.id);
        const statusPromise = new Promise((res, rej) => {
            Axios.post(prop.api_url.status, { status, ids }).then((response: API_RESPONSE) => {
                if (response.settings.success) {
                    res(1);
                    toast.success(response.settings.message);
                } else {
                    rej(statusPromise)
                }
            })
        })
        toast.promise(statusPromise, {
            error: "Something went wrong please try again",
            pending: "Please wait..."
        })
    }



    useEffect(() => {
        callApi()
    }, [status, keyword]);

    return <>
        <div className="container-fluid py-4"> {/* Use container-fluid for full width */}
            <div className="card"> {/* Example: Card structure around the table */}
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h4 className="mb-0">Contacts</h4>
                    <div className="d-flex align-items-center">
                        {/* Status drop down filter */}
                        {(prop?.actions?.status) &&
                            <Select
                                className="basic-single w-75 me-3"
                                classNamePrefix="select"
                                isClearable={true}
                                onChange={(e) => setStatus(e.value)}
                                isDisabled={false}
                                isLoading={false}
                                isSearchable={true}
                                name="color"
                                defaultValue={null}
                                options={[
                                    { value: 'active', label: 'Active' },
                                    { value: 'inactive', label: 'Inactive' },
                                ]} />
                            // <select
                            //     className="form-select w-50 me-2"
                            //     aria-label="Default select example"
                            // >
                            //     <option value="active">Active</option>
                            //     <option value="active">Active</option>
                            //     <option value="inactive">Inactive</option>
                            // </select>
                        }

                        {/* Search Bar and Buttons (Simplified) */}
                        {(prop?.actions?.search) &&
                            <div className="input-group me-2">
                                <input
                                    type="text"
                                    id="searchKeyowrd"
                                    className="form-control"
                                    placeholder="Search"
                                    onChange={e => keyDebouncer(e.target.value)}
                                />
                                {(keyword && keyword != "") ?
                                    <button
                                        className="btn btn-outline-secondary"
                                        type="button"
                                        onClick={clearKeyword}
                                    >
                                        <i className="bi bi-x"></i>
                                    </button> :
                                    <button
                                        className="btn btn-outline-secondary"
                                        type="button"
                                    >
                                        <i className="bi bi-search"></i>
                                    </button>

                                }
                            </div>
                        }

                        {/* Refresh List */}
                        {(prop?.actions?.refresh) &&
                            <button
                                className="btn btn-outline-secondary me-2"
                                onClick={callApi}
                            >
                                <i className="bi bi-arrow-repeat"></i>
                            </button>
                        }

                        {/* Active and Inactive buttons */}
                        {(prop?.actions?.status) &&
                            <>
                                <button
                                    className="btn btn-outline-secondary me-2"
                                    onClick={() => changeStatus('Active')}
                                >
                                    <i className="bi bi-lock"></i>
                                </button>
                                <button
                                    className="btn btn-outline-secondary me-2"
                                    onClick={() => changeStatus('Inactive')}
                                >
                                    <i className="bi bi-unlock"></i>
                                </button>
                            </>
                        }

                        {/* Add Button  */}
                        {(prop.actions.add) &&
                            <button className="btn btn-primary"><i className="bi bi-plus"></i></button>
                        }
                    </div>
                </div>
                <div className="card-body p-0"> {/* p-0 to remove padding if table fills card body */}
                    <div className=" table-responsive h-100" style={{ width: "100%", height: "500px" }}>{/* Make table responsive on smaller screens */}
                        <AgGridReact
                            theme={myTheme}
                            className="common-ag-grid"
                            columnDefs={prop.colDefs}
                            rowData={rowData}
                            defaultColDef={prop.defaultColDef}
                            rowSelection={rowSelection}
                            cellSelection={cellSelection}
                            onGridReady={(e) => Grid = e.api}
                        >
                        </AgGridReact>
                    </div>
                </div>
                {/* Pagination Footer (Simplified) */}
                <div className="card-footer d-flex justify-content-between align-items-center">
                    <span>Showing 1 - 9 of 9</span>
                    <nav aria-label="Page navigation example">
                        <ul className="pagination pagination-sm mb-0">
                            <li className="page-item disabled"><a className="page-link" href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>
                            <li className="page-item active"><a className="page-link" href="#">1</a></li>
                            <li className="page-item disabled"><a className="page-link" href="#" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    </>
}



export function ActionBtn(prop: any) {
    return <>
        <button className="btn btn-danger" onClick={() => alert(111)}>
            <i className="bi bi-trash"></i>
        </button>
    </>
}

export function DateForamate(prop) {
    console.log(prop)
    let date = new Date(prop.value);
    return format(date, "MM/dd/yyyy hh:mm a");
}


export const CommonListComponent = CommonList
