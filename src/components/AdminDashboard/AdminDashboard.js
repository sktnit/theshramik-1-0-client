// import React from 'react'
// import AdminDashboardLayout from '../shared/AdminDashboardLayout'
import { DataGrid } from "@mui/x-data-grid";
import LinearProgress from '@mui/material/LinearProgress'
// import { useDemoData } from '@mui/x-data-grid-generator'
// import { Chip } from '@mui/material';

// function AdminDashboard(props) {
//   const { data } = useDemoData({
//     dataSet: 'Commodity',
//     rowLength: 100000,
//     editable: true,
//   });
//   return (
//     <AdminDashboardLayout>
//       <div style={{ height: 480, width: "100%" }}>
//         <DataGrid
//           // {...data}
//           columns={columns}
//           rows={rows}
//           pageSize={10}
//           rowsPerPageOptions={[10]}
//           onRowMouseEnter={(params, event) => {
//             console.log(params);
//           }}
//           rowHeight={48}
//           sx={{ m: 2 }}
//         />
//       </div>
//     </AdminDashboardLayout>
//   )
// }

// AdminDashboard.propTypes = {}

// const rows = [
//   {
//     id: 1,
//     name: "Maureen J. Wiener",
//     lastLogin: ["a"]
//   },
//   {
//     id: 2,
//     name: "Jerry C. Lewis",
//     lastLogin: ["b"]
//   },
//   {
//     id: 3,
//     name: "Maria R. Noah",
//     dateCreated: "11/15/2021",
//     lastLogin: ["d"]
//   },
//   {
//     id: 4,
//     name: "Shelia T. Patterson",
//     dateCreated: "11/15/2021",
//     lastLogin: ["gn"]
//   },
//   {
//     id: 5,
//     name: "Otis T. Fuller",
//     dateCreated: "11/15/2021",
//     lastLogin: ["jkasdk", "d", "df5s"]
//   }
// ];

// const columns = [
//   { field: "name", headerName: "Name" },
//   {
//     field: "lastLogin",
//     headerName: "Last Login",
//     minWidth: 300,
//     description: "Last Login",
//     renderCell: (params) => {
//       return params.value.map((p) => (
//         <Chip
//           style={{
//             backgroundColor:
//               "#" + Math.random().toString(16).substr(-6)
//           }}
//           variant="outlined"
//           size="small"
//           label={p}
//         />
//       ));
//     },
//     sortComparator: (v1, v2) => v1.name.localeCompare(v2.name)
//   }
// ];
// export default AdminDashboard

import React, { useEffect } from 'react';
import { getPaginatedData } from '../../firebase'
import AppLayout from '../shared/AppLayout';
import UserList from "./UserList";
import TableWithInfiniteScroll from "./TableWtihInfiniteScroll";
// import './AdminDashboard.css';

function sleep(duration) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}

const AdminDashboard = () => {
  const [userList, setUserList] = React.useState([])
  const [lastKey, setLastKey] = React.useState()
  const [loading, setLoading] = React.useState()
  const [empty, setEmpty] = React.useState(false)
  const [selectedIndex, setSelectedIndex] = React.useState(-1)

  const PAGE_SIZE = 10
  const getUsers = async () => {
    const { data, lastDoc } = await getPaginatedData("User", [{ sortedBy: "createdAt", sortedOrder: 'desc' }, { sortedBy: "uid", sortedOrder: 'asc' }], lastKey, PAGE_SIZE)
    await sleep(Math.random() * 500 + 100);
    if (data) {
      // const users = data.map(ele => ele.data())
      let users = []
      data.forEach(doc => users.push({ id: doc.id, ...doc.data() }))
      setUserList((prevUserList) => [...prevUserList, ...users])
      setLastKey(lastDoc)
    } else {
      setEmpty(true)
    }
  }

  useEffect(() => {
    (async () => {
      await fetchUsers()
    })()
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    await getUsers();
    setLoading(false)
  }

  return (<>
    <AppLayout>
      <UserList users={userList} waitingForAPI={loading} hasMoreUsers={!empty} nextUsers={fetchUsers} selectedIndex={selectedIndex} />
      <TableWithInfiniteScroll />
      {/* <div className="AdminDashboard">
        <h1> Infinite scroll in Firebase (firestore) and React.js  </h1>
        <div className="wrapper">
          {userList.map((item, index) => (
            <div key={index} >
              <div className="wrapper__list">
                <p><b> name : </b> {item.firstname}</p>
                <p><b> title : </b>{item.lastname}</p>
                <p><b> Date : </b>{item.createdAt}</p>
              </div>
            </div>
          ))}
          {loading && <h1> Loading... </h1>}
          {!loading && !empty && <button onClick={() => fetchUsers()} className="btn__default">More Posts</button>}
          {empty && <h1> There are no more data </h1>}
        </div>
      </div> */}
    </AppLayout>
  </>)
}
export default AdminDashboard
