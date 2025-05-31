// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   Button,
//   Grid,
//   Chip,
//   Alert,
//   Stack,
//   Divider,
// } from "@mui/material";
// export default function ResourceTracker({
//   bunkerHp,
//   morale,
//   supplies,
//   moraleCountdown,
//   suppliesCountdown,
//   round,
// }) {
//   return (
//     <Card>
//       <CardContent>
//         {/* HP бункера */}
//         <ResourceBar
//           label="🏗️ Прочность бункера"
//           value={bunkerHp}
//           max={7} // Или получать с бэка
//           status={getResourceStatus(bunkerHp, 7)}
//         />

//         {/* Мораль */}
//         <ResourceBar
//           label="😰 Мораль"
//           value={morale}
//           max={10}
//           countdown={moraleCountdown}
//           status={getResourceStatus(morale, 10)}
//         />

//         {/* Припасы */}
//         <ResourceBar
//           label="🍞 Припасы"
//           value={supplies}
//           max={8}
//           countdown={suppliesCountdown}
//           status={getResourceStatus(supplies, 8)}
//         />

//         {/* Раунд */}
//         <Box mt={2}>
//           <Typography variant="h6">📅 Раунд {round}</Typography>
//         </Box>
//       </CardContent>
//     </Card>
//   );
// }
