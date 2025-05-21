"use client"
import React from 'react'
import { useCallback, useEffect, useMemo, useState } from "react";
import { API_RESPONSE, COMMON_LIST_COMPONENT_INTERFACE } from "../utils/general/interface";
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, CheckboxEditorModule, ClientSideRowModelModule, ColDef, DateEditorModule, DateFilterModule, IDateFilterParams, ModuleRegistry, NumberEditorModule, NumberFilterModule, provideGlobalGridOptions, RowSelectionModule, RowSelectionOptions, TextEditorModule, TextFilterModule, themeAlpine, themeBalham, themeQuartz, ValidationModule } from 'ag-grid-community';
import { Axios } from "../utils/axios/service";
import { toast } from "react-toastify";
import { format } from "date-fns";
import Select from 'react-select'
import { useDebouncedCallback } from 'use-debounce';
import ReactPaginate from 'react-paginate';
import Link from 'next/link';


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


function CommonList(prop: COMMON_LIST_COMPONENT_INTERFACE) {
    const myTheme = themeAlpine || themeBalham;
    const [rowData, setRowData] = useState([]);
    const [status, setStatus] = useState(null);
    const [keyword, setKeyword] = useState(null);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [sort, setSort] = useState(null)
    const [grid, setGrid] = useState(null);
    const [pagination, setPagination] = useState<any>({})
    const Grid = useMemo(() => grid?.api, [grid])


    const changeDetectionsArr = [status, keyword, page, limit, sort];

    // select multiple rows
    const rowSelection: RowSelectionOptions = useMemo(() => {
        return {
            mode: 'multiRow',
        };
    }, []);

    // select multiple rows relaed code
    const cellSelection = useMemo(() => {
        return {
            enableHeaderHighlight: true,
        };
    }, []);

    // Detect keywod changes
    const keyDebouncer = useDebouncedCallback(
        // function
        (value) => {
            setPage(1);
            setKeyword(value);
        },
        // delay in 1s
        1000
    );

    // Clear Search keyword
    const clearKeyword = useCallback(() => {
        // @ts-ignore
        document.getElementById('searchKeyowrd').value = null;
        setKeyword(null)
    }, [])

    // Status Change
    const changeStatus = useCallback((e) => {
        setPage(1);
        setStatus(e ? e.value : null);
    }, [])

    // Limit change
    const changeLimit = useCallback((e) => {
        setPage(1);
        setLimit(e ? e.value : null);
    }, []);

    // Page Change
    const handlePageClick = useCallback(async (page: any) => {
        setPage(page.selected + 1);
    }, []);

    // Sort changes
    const sortChange = useCallback((sortField) => {
        console.log(sortField)
        if (prop.actions.sort) {
            let sortDir = []
            sortField.columns.forEach(field => {
                if (field.colId && field.sort) {
                    sortDir.push({
                        prop: field.colId,
                        dir: field.sort
                    })
                }
            })
            setSort(sortDir)
        }

    }, []);

    // Update Row(s) Status
    const updateStatus = useCallback(async (status) => {
        const selectedRows = Grid?.getSelectedRows() || [];
        const ids = selectedRows.map(e => e.id);
        if (ids.length) {
            const statusPromise = new Promise((res, rej) => {
                Axios.post(prop.api_url.status, { status, ids }).then((response: API_RESPONSE) => {
                    if (response.settings.success) {
                        res(1);
                        toast.success(response.settings.message);
                        callApi();
                    } else {
                        rej(statusPromise)
                    }
                })
            })
            toast.promise(statusPromise, {
                error: "Something went wrong please try again",
                pending: "Please wait..."
            })
        } else {
            toast.error("Please select atleat one contact.")
        }
    }, []);

    // Call List Api
    const callApi = useCallback(async () => {
        const filters: any = {
            page: page,
            limit: limit
        };

        if (status) {
            filters.status = status;
        }

        if (keyword) {
            filters.keyword = keyword;
        }

        if (sort) {
            filters.sort = sort;
        }

        Axios.post(prop.api_url.list, filters).then((res: API_RESPONSE) => {
            if (!res?.settings?.success) {
                toast.error(res?.settings?.message || "Something went wrong please try again.");
                setRowData([]);
            } else {
                toast.success(res.settings.message);
                setRowData(res.data);
                setPagination(res.settings);
            }
        })
    }, changeDetectionsArr);

    // Detect Effects and call List Api
    useEffect(() => {
        callApi()
    }, changeDetectionsArr);

    return <>
        <div className="container-fluid py-4"> {/* Use container-fluid for full width */}
            <div className="card"> {/* Example: Card structure around the table */}
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h4 className="mb-0" title={prop.description}>{prop.name}</h4>
                    {/* full screen propose */}
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <i className="bi bi-list-task"></i>
                    </button>
                    <div className="common-action-btn">
                        {/* Status drop down filter */}
                        {(prop?.actions?.status) &&
                            <Select
                                className="basic-single w-75 me-3"
                                classNamePrefix="select"
                                isClearable={true}
                                onChange={changeStatus}
                                isDisabled={false}
                                isLoading={false}
                                isSearchable={true}
                                name="color"
                                defaultValue={null}
                                options={prop.actions_options?.filter_status_options || filterStatusOptions} />
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
                                    onClick={() => updateStatus('Active')}
                                >
                                    <i className="bi bi-lock"></i>
                                </button>
                                <button
                                    className="btn btn-outline-secondary me-2"
                                    onClick={() => updateStatus('Inactive')}
                                >
                                    <i className="bi bi-unlock"></i>
                                </button>
                            </>
                        }

                        {/* Add Button  */}
                        {(prop.actions.add && prop.add_update_actions.add.redirect && prop.add_update_actions.add.redirect_url) &&
                            <Link href={prop.add_update_actions.add.redirect_url} className="btn btn-primary"><i className="bi bi-plus"></i></Link>
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
                            defaultColDef={prop.default_col_def}
                            rowSelection={rowSelection}
                            cellSelection={cellSelection}
                            onGridReady={(e) => setGrid(e)}
                            onSortChanged={sortChange}
                        >
                        </AgGridReact>
                    </div>
                </div>

                {/* Pagination Footer (Simplified) */}
                <div className="card-footer d-flex justify-content-between align-items-center">
                    <span>
                        Showing &nbsp;
                        {(pagination.limit * (pagination.page - 1)) + 1} - &nbsp;
                        {((pagination.limit * (pagination.page)) <= pagination.count) ? (pagination.limit * (pagination.page)) : pagination.count - (pagination.limit * (pagination.page - 1)) + (pagination.limit * (pagination.page - 1))} of {pagination.count}</span>
                    <nav aria-label="Page navigation" className='pagination-nav'>
                        <Select
                            className="common-limit-select w-50 me-3"
                            classNamePrefix="select"
                            onChange={changeLimit}
                            isDisabled={false}
                            isLoading={false}
                            isSearchable={false}
                            name="color"
                            defaultValue={{ value: '5', label: '5' }}
                            options={prop.actions_options.pagination_options || paginationsOptions} />
                        <ReactPaginate
                            nextLabel=">"
                            onPageChange={handlePageClick}
                            pageRangeDisplayed={3}
                            marginPagesDisplayed={2}
                            pageCount={pagination.total_pages}
                            previousLabel="<"
                            pageClassName="page-item"
                            pageLinkClassName="page-link"
                            previousClassName="page-item"
                            previousLinkClassName="page-link"
                            nextClassName="page-item"
                            nextLinkClassName="page-link"
                            breakLabel="..."
                            breakClassName="page-item"
                            breakLinkClassName="page-link"
                            containerClassName="pagination"
                            activeClassName="active"
                            renderOnZeroPageCount={null}
                            forcePage={page - 1}
                        />
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
    let date = new Date(prop.value);
    return format(date, "MM/dd/yyyy hh:mm a");
}

export const paginationsOptions = [
    { value: '5', label: '5' },
    { value: '10', label: '10' },
    { value: '20', label: '20' },
    { value: '30', label: '30' },
    { value: '50', label: '50' },
    { value: '100', label: '100' },
    { value: '200', label: '200' },
];

export const filterStatusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
]
export const CommonListComponent = CommonList
