import './App.css';
import 'antd/dist/antd.min.css';
import { useEffect, useState } from 'react';
import { Table, Space, message } from 'antd';
import axios from 'axios';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';


function App() {
  const paginationConfig = {
    pageSizeOptions: ['5', '10', '15']
  };
  const [dataSource, setdataSource] = useState(generateDataSource(100));
  // const [dataSource, setdataSource] = useState([]);

  const url = 'https://nphc-hr.free.beeceptor.com/employees';
  // temporary comment out for testing , free version of beeceptor have limit of 50 per day
  // useEffect(() => {
  //   axios
  //     .get(url)
  //     .then((response) => {
  //       console.log(response);
  //       setdataSource(response.data)
  //     }
  //     )
  //     .catch((error) => message.error('There is an error when getting employee data.', error.message));
  //   // .finally(() => setLoaded(true));
  // }, []);

  function generateDataSource(value) {
    let dataSourceArray = [];
    for (let i = 1; i <= value; i++) {
      dataSourceArray.push({
        key: i,
        id: i,
        full_name: 'Harry Potter ' + i,
        login_id: 'hpotter',
        salary: (i + 1049).toString(),
      });
    };
    return dataSourceArray;
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Name',
      dataIndex: 'full_name',
      key: 'name',
      sorter: (a, b) => a.full_name.localeCompare(b.full_name),
    },
    {
      title: 'Login',
      dataIndex: 'login_id',
      key: 'login',
      sorter: (a, b) => a.login_id.localeCompare(b.login_id),
    },
    {
      title: 'Salary',
      dataIndex: 'salary',
      key: 'salary',
      sorter: (a, b) => a.salary - b.salary,
    },
    {
      title: 'Action',
      key: 'action',
      render: (record) => (
        <Space>
          <EditOutlined></EditOutlined>
          <DeleteOutlined></DeleteOutlined>
        </Space>
      ),
    },
  ];

  return (
    <div className="App">
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={paginationConfig}
      />
    </div>
  );
}

export default App;
