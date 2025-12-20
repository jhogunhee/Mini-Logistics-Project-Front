import {useEffect, useRef, useState} from "react";
import {AgGridReact} from "ag-grid-react";
import SearchArea from '@/components/search/SearchArea';

export default function Zone() {
    const gridRef = useRef(null);

    const [rowData, setRowData] = useState([]);
    const [searchParam, setSearchParam] = useState({
          zoneCode : ''
        , zoneName : ''
    });

    /* =========================
       컬럼 정의
    ========================= */
    const columnDefs = [{
        headerName: "Zone 코드", field: "ZONE_CD", flex: 1, minWidth: 120, editable: true, cellClassRules: {
            "border border-red-300": p => !p.value,
        },
    }, {
        headerName: "Zone 명", field: "ZONE_NM", minWidth: 180, flex: 1.5, editable: true,
    }, {
        headerName: "보관유형",
        field: "STORAGE_TYPE",
        flex: 1,
        editable: true,
        minWidth: 140,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: {
            values: ["ROOM", "CHILL", "FROZEN"],
        },
        valueFormatter: (p) => {
            switch (p.value) {
                case "ROOM":
                    return "상온";
                case "CHILL":
                    return "냉장";
                case "FROZEN":
                    return "냉동";
                default:
                    return p.value;
            }
        },
    }, {
        headerName: "사용",
        field: "USE_YN",
        flex: 0.7,
        minWidth: 100,
        editable: true,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: {
            values: ["Y", "N"],
        },
    },];

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
        setRowData((prev) => [{
            ZONE_CD: "", ZONE_NM: "", ZONE_TYPE: "STORAGE", TEMP_TYPE: "AMB", USE_YN: "Y", _rowStatus: "I", // 신규
        }, ...prev,]);
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
    const onSearch = async () => {
        const params = new URLSearchParams({
              zoneCd : searchParam['zoneCd']
            , zoneNm : searchParam['zoneNm']
        });

        const response = await fetch(`http://localhost:8080/master/selectZoneList?${params.toString()}`);

        const data = await response.json();
        setRowData(data);
    };

    const onSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchParam(prev => ({
            ...prev,
            [name]: value
        }));
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

    const removeRow = () => {
        const selected = gridRef.current.api.getSelectedRows();
        if (selected.length === 0) {
            alert("삭제할 행을 선택하세요.");
            return;
        }

        gridRef.current.api.applyTransaction({
            remove: selected,
        });
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
            method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(rows),
        });

        alert("저장 완료");
        fetchZones();
    };

    return (<div className="w-full">
            <div className="mb-4">
                <div className="text-sm text-gray-500">
                    Master <span className="mx-1">{'>'}</span> Zone
                </div>
            </div>

            {/* ================= Search ================= */}
            <SearchArea>
                <div className="search-row">
                    <div className="search-item">
                        <label className="search-label">Zone 코드</label>
                        <input className="search-input" name="zoneCd" onChange={onSearchChange}/>
                    </div>

                    <div className="search-item">
                        <label className="search-label">Zone 명</label>
                        <input className="search-input" name="zoneNm" onChange={onSearchChange}/>
                    </div>

                    <button className="search-button" onClick={onSearch}>조회</button>
                </div>
            </SearchArea>

            {/* ================= Grid Card ================= */}
            <div className="bg-white border rounded-lg shadow-sm w-full">

                {/* Grid Header */}
                <div className="flex items-center justify-between px-6 py-3 border-b">
                <span className="text-sm font-medium text-gray-700">
                Zone 목록
                </span>

                    <div className="flex gap-2">
                        <button onClick={addRow} className="px-3 py-1.5 text-sm border rounded-md hover:bg-gray-50">
                            행추가
                        </button>
                        <button
                            onClick={removeRow}
                            className="px-3 py-1.5 text-sm border rounded-md hover:bg-gray-50"
                        >
                            행삭제
                        </button>
                        <button
                            onClick={save}
                            className="px-4 py-1.5 text-sm bg-gray-900 text-white rounded-md"
                        >
                            저장
                        </button>
                    </div>
                </div>

                {/* Grid */}
                <div className="p-3">
                    <div className="ag-theme-quartz w-full h-[420px]">
                        <AgGridReact
                            ref={gridRef}
                            rowData={rowData}
                            columnDefs={columnDefs}
                            defaultColDef={{
                                resizable: true, sortable: true, cellStyle: {padding: "6px 10px"},
                            }}
                            rowHeight={36}
                            headerHeight={38}
                            rowSelection="single"
                            stopEditingWhenCellsLoseFocus
                        />
                    </div>
                </div>
            </div>
        </div>);
}
