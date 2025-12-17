import { useEffect, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

export default function Rack() {
    const gridRef = useRef(null);

    const [rowData, setRowData] = useState([]);
    const [searchText, setSearchText] = useState("");

    /* =========================
       컬럼 정의
    ========================= */
    const columnDefs = [
        {
            headerName: "Zone 코드",
            field: "ZONE_CD",
            editable: true,
            width: 120,
            cellClassRules: {
                "bg-yellow-50": (p) => !p.value,
            },
        },
        {
            headerName: "Zone 명",
            field: "ZONE_NM",
            editable: true,
            flex: 1,
            cellClassRules: {
                "bg-yellow-50": (p) => !p.value,
            },
        },
        {
            headerName: "Zone 타입",
            field: "ZONE_TYPE",
            editable: true,
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: ["STORAGE", "PICK", "OUT"],
            },
            width: 140,
        },
        {
            headerName: "온도",
            field: "TEMP_TYPE",
            editable: true,
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: ["AMB", "CHILL", "FROZEN"],
            },
            width: 120,
        },
        {
            headerName: "사용",
            field: "USE_YN",
            editable: true,
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: ["Y", "N"],
            },
            width: 90,
        },
    ];

    /* =========================
       조회
    ========================= */
    const fetchZones = async () => {
        const res = await fetch("/api/zones");
        const data = await res.json();
        setRowData(data);
    };

    useEffect(() => {
        const load = async () => {
            const res = await fetch("/api/zones");
            const data = await res.json();
            setRowData(data);
        };

        load();
    }, []);

    /* =========================
       행 추가
    ========================= */
    const addRow = () => {
        setRowData((prev) => [
            {
                ZONE_CD: "",
                ZONE_NM: "",
                ZONE_TYPE: "STORAGE",
                TEMP_TYPE: "AMB",
                USE_YN: "Y",
                _rowStatus: "I", // 신규
            },
            ...prev,
        ]);
    };

    /* =========================
       수정 상태 관리
    ========================= */
    const onCellValueChanged = (params) => {
        if (!params.data._rowStatus) {
            params.data._rowStatus = "U";
        }
    };

    /* =========================
       검색 (Zone 코드 / 명)
    ========================= */
    const onSearchChange = (e) => {
        const value = e.target.value;
        setSearchText(value);

        if (gridRef.current) {
            gridRef.current.api.setQuickFilter(value);
        }
    };

    /* =========================
       저장 전 검증
    ========================= */
    const validateRows = (rows) => {
        for (const r of rows) {
            if (!r.ZONE_CD || !r.ZONE_NM) {
                alert("Zone 코드와 Zone 명은 필수입니다.");
                return false;
            }
        }
        return true;
    };

    /* =========================
       저장
    ========================= */
    const save = async () => {
        const rows = [];
        gridRef.current.api.forEachNode((n) => {
            if (n.data._rowStatus) {
                rows.push(n.data);
            }
        });

        if (rows.length === 0) {
            alert("변경된 데이터가 없습니다.");
            return;
        }

        if (!validateRows(rows)) return;

        await fetch("/api/zones/save", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(rows),
        });

        alert("저장 완료");
        fetchZones();
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-3">Zone 기준관리</h2>

            {/* =========================
          Toolbar
      ========================= */}
            <div className="flex items-center gap-2 mb-2">
                <input
                    type="text"
                    placeholder="Zone 코드 / Zone 명 검색"
                    value={searchText}
                    onChange={onSearchChange}
                    className="px-3 py-1 border rounded w-64 text-sm"
                />

                <button
                    className="px-3 py-1 border rounded hover:bg-gray-100"
                    onClick={fetchZones}
                >
                    조회
                </button>

                <button
                    className="px-3 py-1 border rounded hover:bg-gray-100"
                    onClick={addRow}
                >
                    행추가
                </button>

                <button
                    className="px-3 py-1 border bg-black text-white rounded"
                    onClick={save}
                >
                    저장
                </button>
            </div>

            {/* =========================
          Grid
      ========================= */}
            <div className="ag-theme-alpine h-[520px]">
                <AgGridReact
                    ref={gridRef}
                    rowData={rowData}
                    columnDefs={columnDefs}
                    onCellValueChanged={onCellValueChanged}
                    defaultColDef={{
                        resizable: true,
                        sortable: true,
                    }}
                    stopEditingWhenCellsLoseFocus
                />
            </div>
        </div>
    );
}
