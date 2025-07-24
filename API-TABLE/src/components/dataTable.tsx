import { useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputSwitch } from 'primereact/inputswitch';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

interface Article {
    id: number;
    title: string;
    place_of_origin: string;
    artist_display: string;
    inscriptions: string;
    date_start: number;
    date_end: number;
}

interface DataTableProps {
    articledata: Article[];
    currentPage: number;
}

export default function Datatable({ articledata, currentPage }: DataTableProps) {
    // Initialize as empty array instead of null
    const [selectedarticle, setSelectedarticle] = useState<Article[]>([]);
    const [rowClick, setRowClick] = useState<boolean>(true);
    const [rowInput, setRowInput] = useState<string>('');
    const op = useRef<OverlayPanel>(null);

    // Function to handle row selection based on input
    const handleRowSelection = async (): Promise<void> => {
        const numberOfRows: number = parseInt(rowInput);
        let collectedRows: Article[] = [...articledata];

        // Calculate how many more rows are needed
        let remaining: number = numberOfRows - collectedRows.length;
        let nextPage: number = currentPage + 1;

        while (remaining > 0) {
            try {
                const response = await fetch(`https://api.artic.edu/api/v1/artworks?page=${nextPage}`);
                const newRows = await response.json();
                const newData: Article[] = newRows.data;

                collectedRows = [...collectedRows, ...newData];
                remaining -= newData.length;
                nextPage++;
            } catch (err) {
                console.error("Failed to fetch extra rows", err);
                break;
            }
        }

        const selectedRows: Article[] = collectedRows.slice(0, numberOfRows);
        setSelectedarticle(selectedRows);
        
        op.current?.hide();
        setRowInput('');
    };

    // Custom header template for the action column
    const actionHeaderTemplate = () => {
        return (
            <div className="flex justify-content-center">
                <Button 
                    icon="pi pi-check" 
                    aria-label="Filter" 
                    className="p-button-text p-button-plain p-button-sm"
                    label="overlay panel"
                    style={{color: 'black'}} 
                    onClick={(e) => op.current?.toggle(e)} 
                />
                
                <OverlayPanel 
                    style={{ 
                        padding: '1rem', 
                        backgroundColor: 'white', 
                        borderRadius: '6px', 
                        boxShadow: '0 2px 10px rgba(0,0,0,0.15)' 
                    }} 
                    ref={op}
                >
                    <div className="p-2">
                        <InputText 
                            placeholder="Enter number of Rows" 
                            className="mb-2" 
                            value={rowInput}
                            onChange={(e) => setRowInput(e.target.value)}
                        />
                        <br />
                        <br />
                        <Button 
                            label="Submit"
                            style={{backgroundColor: 'black'}} 
                            className="p-button-sm" 
                            onClick={handleRowSelection}
                        />
                    </div>
                </OverlayPanel>
            </div>
        );
    };

    return (
        <div className="card">
            <div className="flex justify-content-center align-items-center mb-4 gap-2">
                <InputSwitch 
                    inputId="input-rowclick" 
                    checked={rowClick} 
                    onChange={(e: { value: boolean }) => setRowClick(e.value)} 
                />
                <label htmlFor="input-rowclick">Row Click</label>
            </div>
                     
            <DataTable 
                value={articledata} 
                selectionMode={rowClick ? undefined :'multiple'}
                selection={selectedarticle} 
                onSelectionChange={(e: any) => setSelectedarticle(e.value as Article[])}
                dataKey="id" 
                tableStyle={{ minWidth: '50rem' }}
            >
                <Column 
                    selectionMode="multiple" 
                    headerStyle={{ width: '3rem' }}
                />
                
                <Column 
                    header={actionHeaderTemplate}
                    headerStyle={{ width: '4rem', textAlign: 'center' }}
                    bodyStyle={{ textAlign: 'center' }}
                />
                <Column field="title" header="Title" />
                <Column field="place_of_origin" header="Place of Origin" /> 
                <Column field="artist_display" header="Artist" /> 
                <Column field="inscriptions" header="Inscriptions" /> 
                <Column field="date_start" header="Start Date" /> 
                <Column field="date_end" header="End Date" />
            </DataTable>
        </div>
    );
}