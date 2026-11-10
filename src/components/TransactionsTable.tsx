import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  InputAdornment,
  TextField,
  Button,
  ButtonBase,
} from "@mui/material";
import { useState } from "react";
import StatusPill from "./StatusPill";
import { colors } from "../config/colors";
import type { Transaction } from "../types/overview";
import { nairaFull, shortDate, timeOnly } from "../utils/format";
import SearchIcon from "../assets/icons/search.svg?react";
import FilterIcon from "../assets/icons/filter.svg?react";
import { chartShadow } from "../config/colors";

const columns = [
  { label: "Transaction ID", width: 150 },
  { label: "Virtual Acct No", width: 140 },
  { label: "Collection Acct No", width: 170 },
  { label: "Customer Name", width: 170 },
  { label: "Amount", width: 190 },
  { label: "Date/Time", width: 140 },
  { label: "Status", width: 130 },
  { label: "Notification", width: 140 },
];

type TabKey = "collections" | "payouts";

const tabInfo: Record<
  TabKey,
  { label: string; title: string; subtitle: string }
> = {
  collections: {
    label: "FSDH 360",
    title: "Collection Transactions (FSDH360)",
    subtitle: "Keep track of all FSDH 360 transactions.",
  },

  payouts: {
    label: "FSDH PAY",
    title: "Payout Transactions (FSDH PAY)",
    subtitle: "Keep track of all  Payout Transactions.",
  },
};

function matchesSearch(row: Transaction, text: string) {
  const haystack = [
    row.id,
    row.virtualAcct,
    row.collectionAcct,
    row.collectionAcctName,
    row.customer,
    String(row.amount),
    nairaFull(row.amount),
    shortDate(row.date),
    timeOnly(row.date),
    row.status,
    row.notification,
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(text.toLowerCase());
}

interface TransactionsTableProps {
  collectionRows: Transaction[];
  collectionTotal?: number;
  payoutRows?: Transaction[];
  pageSize?: number;
  searchPlaceholder?: string;
}

export default function TransactionsTable({
  collectionRows,
  collectionTotal,
  payoutRows,
  pageSize = 7,
  searchPlaceholder = "Search by date, amount, Account No, ref...",
}: TransactionsTableProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("collections");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const hasTabs = payoutRows !== undefined;
  const rows =
    activeTab === "collections" ? collectionRows : (payoutRows ?? []);
  const info = tabInfo[activeTab];

  const searchText = search.trim();
  const filteredRows = searchText
    ? rows.filter((row) => matchesSearch(row, searchText))
    : rows;
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const pageRows = filteredRows.slice((page - 1) * pageSize, page * pageSize);

  const badgeCount = searchText
    ? filteredRows.length
    : activeTab === "collections"
      ? (collectionTotal ?? rows.length)
      : rows.length;

  const handleSearch = (text: string) => {
    setSearch(text);
    setPage(1);
  };

  const handleTab = (tab: TabKey) => {
    setActiveTab(tab);
    setPage(1);
  };
  const SEARCH_FONT = '"Google Sans", sans-serif';

  return (
    <Box
      sx={{
        bgcolor: "#fff",
        border: `1px solid ${colors.border}`,
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      {hasTabs && (
        <Box sx={{ p: 2, borderBottom: `1px solid ${colors.border}` }}>
          <Box
            role="tablist"
            sx={{
              display: "inline-flex",
              border: "1px solid #D0D5DD",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            {(Object.keys(tabInfo) as TabKey[]).map((key) => {
              const isActive = key === activeTab;
              return (
                <ButtonBase
                  key={key}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleTab(key)}
                  sx={{
                    px: 2.5,
                    py: 1.25,
                    fontSize: 14,
                    fontWeight: 600,
                    fontFamily: '"Google Sans", sans-serif',
                    bgcolor: isActive ? colors.navy : "#fff",
                    color: isActive ? "#fff" : colors.textDark,
                  }}
                >
                  {tabInfo[key].label}
                </ButtonBase>
              );
            })}
          </Box>
        </Box>
      )}

      <Box
        sx={{
          p: 3,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography
              component="h3"
              sx={{
                fontWeight: 700,
                fontSize: 18,
                color: colors.inflowText,
                fontFamily: '"Google Sans", sans-serif',
              }}
            >
              {info.title}
            </Typography>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: 28,
                height: 25,
                border: "1px solid #D0D5DD",
                borderRadius: "4px",
                px: 0.75,
                fontSize: 12,
                lineHeight: 1,
                color: colors.textDark,
                textAlign: "center",
                fontFamily: '"Google Sans", sans-serif',
              }}
            >
              {badgeCount}
            </Box>
          </Box>
          <Typography
            sx={{
              fontSize: 14,
              color: colors.volumeTrendsT,
              mt: 0.5,
              fontFamily: '"Google Sans", sans-serif',
            }}
          >
            {info.subtitle}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            fontFamily: '"Google Sans", sans-serif',
          }}
        >
          <TextField
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={searchPlaceholder}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{
              width: { xs: "100%", md: 400 },
              boxShadow: chartShadow,

              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                height: 44,

                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#D0D5DD",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#98A2B3",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: colors.primary,
                  borderWidth: 1,
                },
              },

              "& .MuiInputBase-input": {
                fontFamily: SEARCH_FONT,
                fontSize: 14,
                color: "#464655",
              },

              "& .MuiInputBase-input::placeholder": {
                fontFamily: SEARCH_FONT,
                color: "#464655",
                opacity: 1,
              },
            }}
          />

          {/* TODO: no design yet for what Filters opens */}
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            sx={{
              height: 44,
              px: 2,
              borderRadius: 999,
              boxShadow: chartShadow,
              textTransform: "none",
              fontWeight: 600,
              color: colors.textDark,
              borderColor: "#D0D5DD",
              fontFamily: '"Google Sans", sans-serif',
            }}
          >
            Filters
          </Button>
        </Box>
      </Box>

      <TableContainer sx={{ overflowX: "auto" }}>
        <Table
          sx={{
            minWidth: 1200,
            "& .MuiTableCell-root": {
              fontSize: 14,
              py: 1.5,
              borderBottom: `1px solid ${colors.border}`,
            },
            "& thead .MuiTableCell-root": {
              borderTop: `1px solid ${colors.border}`,
            },
            "& .MuiTableCell-root:first-of-type": { pl: 3 },
            "& .MuiTableCell-root:last-of-type": { pr: 3 },
          }}
        >
          <TableHead className="bg-[#F9FAFB]">
            <TableRow sx={{ height: 52 }}>
              {columns.map((col) => (
                <TableCell
                  key={col.label}
                  sx={{
                    minWidth: col.width,
                    color: colors.volumeTrendsT,
                    fontSize: 13,
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                  }}
                >
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          {pageRows.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                align="center"
                sx={{ py: 6, color: colors.volumeTrendsT }}
              >
                No transactions found
              </TableCell>
            </TableRow>
          )}

          <TableBody>
            {pageRows.map((row) => (
              <TableRow key={row.id} sx={{ height: 72 }}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.virtualAcct}</TableCell>
                <TableCell>
                  <Typography
                    sx={{
                      fontSize: 14,
                      color: colors.tableBodyT,
                      fontWeight: 500,
                    }}
                  >
                    {row.collectionAcct}
                  </Typography>
                  <Typography sx={{ fontSize: 13 }}>
                    {row.collectionAcctName}
                  </Typography>
                </TableCell>
                <TableCell sx={{ color: colors.tableBodyT }}>
                  {row.customer}
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: colors.tableBodyT }}>
                  {nairaFull(row.amount)}
                </TableCell>
                <TableCell>
                  <Typography sx={{ fontSize: 14, color: colors.tableBodyT }}>
                    {shortDate(row.date)}
                  </Typography>
                  <Typography
                    sx={{ fontSize: 13, color: colors.volumeTrendsT }}
                  >
                    {timeOnly(row.date)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <StatusPill status={row.status} />
                </TableCell>
                <TableCell>
                  <StatusPill status={row.notification} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box
        sx={{
          px: 3,
          py: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            fontSize: 14,
            color: "#222242",
            fontFamily: '"Google Sans", sans-serif',
          }}
        >
          Page {page} of {totalPages}
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 1.5,
          }}
        >
          <Button
            variant="outlined"
            size="small"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            sx={{
              borderRadius: 999,
              textTransform: "none",
              fontWeight: 600,
              px: 2,
              color: "#222242",
              borderColor: "#D0D5DD",
              fontFamily: '"Google Sans", sans-serif',
            }}
          >
            Previous
          </Button>
          <Button
            variant="outlined"
            size="small"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            sx={{
              borderRadius: 999,
              textTransform: "none",
              fontWeight: 600,
              px: 2,
              color: "#222242",
              borderColor: "#D0D5DD",
              fontFamily: '"Google Sans", sans-serif',
            }}
          >
            Next
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
