// "use client";

// import { useEffect, useState } from "react";

// type Account = {
//   account_id: string;
//   display_name: string;
//   currency: string;
//   account_type: string;
// };

// export default function HomePage() {
//   const [accounts, setAccounts] = useState<Account[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       setLoading(false);
//       return;
//     }

//     fetch("http://localhost:3001/api/accounts", {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         setAccounts(data.results || []);
//         setLoading(false);
//       })
//       .catch(() => setLoading(false));
//   }, []);

//   if (loading) return <div>Loading...</div>;

//   return (
//     <main style={{ padding: "24px" }}>
//       <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>
//         💸 My Accounts
//       </h1>

//       {accounts.map((acc) => (
//         <div
//           key={acc.account_id}
//           style={{
//             padding: "16px",
//             marginBottom: "12px",
//             borderRadius: "12px",
//             background: "#1e293b",
//             color: "white",
//           }}
//         >
//           <h2>{acc.display_name}</h2>
//           <p>Type: {acc.account_type}</p>
//           <p>Currency: {acc.currency}</p>
//         </div>
//       ))}
//     </main>
//   );
// }