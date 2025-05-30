import Button from "@mui/material/Button";

export default function GradientButton(props) {
  const { color = "primary", ...rest } = props;
  const gradient =
    color === "primary"
      ? "linear-gradient(45deg,#ff6b35,#ff8a65)"
      : "linear-gradient(45deg,#4caf50,#81c784)";

  return (
    <Button
      variant="contained"
      sx={{
        background: gradient,
        "&:hover": { background: gradient, filter: "brightness(1.1)" }
      }}
      {...rest}
    />
  );
}