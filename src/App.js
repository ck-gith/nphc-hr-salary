import './App.css';
import 'antd/dist/antd.min.css';
import { useState } from 'react';
import { Table } from 'antd';

function App() {
  const [dataSource, setdataSource] = useState(generateDataSource(100));

  generateDataSource(100);

  function generateDataSource(value) {
    let dataSourceArray = [];
    for (let i = 1; i <= value; i++) {
      dataSourceArray.push({
        key: i,
        id: i,
        name: 'Harry Potter ' + i,
        login: 'hpotter',
        salary: '1234.00',
      });
    };
    return dataSourceArray;
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Login',
      dataIndex: 'login',
      key: 'login',
    },
    {
      title: 'Salary',
      dataIndex: 'salary',
      key: 'salary',
    }
  ];

  return (
    <div className="App">
      <Table
        dataSource={dataSource}
        columns={columns}
      />
    </div>
  );
}

export default App;
