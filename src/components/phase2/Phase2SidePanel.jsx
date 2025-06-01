import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Tabs,
  Tab,
  Typography,
  Badge,
} from "@mui/material";
import {
  Groups as TeamsIcon,
  History as HistoryIcon,
  BarChart as StatsIcon,
  Bolt as StatusIcon,
} from "@mui/icons-material";
import TeamStatusPanel from "./TeamStatsDisplay";
import DetailedHistoryView from "./DetailedHistoryView";
import TeamStatsDisplay from "./TeamStatsDisplay";
import ActiveStatusesView from "./ActiveStatusesView";
import usePhase2Selectors from "../../hooks/usePhase2Selectors";

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`phase2-tabpanel-${index}`}
      aria-labelledby={`phase2-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

export default function Phase2SidePanel({
  myTeam,
  currentTeam,
  bunkerMembers,
  outsideMembers,
  actionQueue,
}) {
  const [tabValue, setTabValue] = useState(0);

  const { teamStats, activeStatuses } = usePhase2Selectors();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Получаем количество записей в истории для badge
  const { game } = usePhase2Selectors();
  const historyCount = game?.phase2?.detailed_history?.length || 0;
  const statusCount = activeStatuses?.length || 0;

  return (
    <Card
      sx={{
        height: "fit-content",
        maxHeight: "80vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardContent
        sx={{ p: 0, flex: 1, display: "flex", flexDirection: "column" }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            minHeight: 48,
            "& .MuiTab-root": {
              minHeight: 48,
              fontSize: "0.8rem",
            },
          }}
        >
          <Tab
            icon={<TeamsIcon />}
            label="Команды"
            id="phase2-tab-0"
            aria-controls="phase2-tabpanel-0"
          />
          <Tab
            icon={
              <Badge badgeContent={historyCount} color="primary" max={99}>
                <HistoryIcon />
              </Badge>
            }
            label="История"
            id="phase2-tab-1"
            aria-controls="phase2-tabpanel-1"
          />
          <Tab
            icon={<StatsIcon />}
            label="Статы"
            id="phase2-tab-2"
            aria-controls="phase2-tabpanel-2"
          />
          <Tab
            icon={
              <Badge badgeContent={statusCount} color="error" max={99}>
                <StatusIcon />
              </Badge>
            }
            label="Статусы"
            id="phase2-tab-3"
            aria-controls="phase2-tabpanel-3"
          />
        </Tabs>

        <Box sx={{ flex: 1, overflow: "hidden" }}>
          <TabPanel value={tabValue} index={0}>
            <TeamStatusPanel
              myTeam={myTeam}
              currentTeam={currentTeam}
              bunkerMembers={bunkerMembers}
              outsideMembers={outsideMembers}
              actionQueue={actionQueue}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <DetailedHistoryView showTitle={false} />
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <TeamStatsDisplay teamStats={teamStats} showTitle={false} />
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <ActiveStatusesView
              activeStatuses={activeStatuses}
              showTitle={false}
            />
          </TabPanel>
        </Box>
      </CardContent>
    </Card>
  );
}
