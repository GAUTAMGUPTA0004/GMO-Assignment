import { Paginator } from 'primereact/paginator';

interface PAGINATIONProps {
    first: number;
    rows: number;
    onPageChange: (event: { first: number; rows: number }) => void;
}

export default function PAGINATION({ first, rows, onPageChange }: PAGINATIONProps) {
    return (
        <div className="card">
            <Paginator first={first} rows={rows} totalRecords={129230} rowsPerPageOptions={[12]} onPageChange={onPageChange} />
        </div>
    );
}
        