import { useEffect, useState } from "react";
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import filterFactory, { numberFilter, textFilter } from 'react-bootstrap-table2-filter';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';

const Todos = () => {
    const [todoList, setTodoList] = useState([])

    const columns = [
        {dataField: "id", text: "ID", sort: true, filter: numberFilter()},
        {dataField: "userId", text: "User ID", sort: true},
        {dataField: "title", text: "Title", sort: true, filter: textFilter()},
        {dataField: "completed", text: "Completed", sort: true},
    ]

    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/todos')
            .then(response => response.json())
            .then(details => setTodoList(details))
            .catch(err => console.log(err));
    }, [])

    return (
        <>
            <div className="p-3">
                <BootstrapTable bootstrap4 keyField="id" columns={columns} data={todoList} filter={filterFactory()} />
            </div>
        </>
    );
}

export default Todos;