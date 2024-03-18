export const Plus = ({color, props}) => (
  <svg
    width="25"
    height="25"
    viewBox="0 0 25 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <mask
      id="mask0_2012_11823"
      maskUnits="userSpaceOnUse"
      x="0"
      y="0"
      width="25"
      height="25"
    >
      <rect x="0.8125" y="0.5" width="24" height="24" fill="#D9D9D9" />
    </mask>
    <g mask="url(#mask0_2012_11823)">
      <path
        d="M11.8125 19.5V13.5H5.8125V11.5H11.8125V5.5H13.8125V11.5H19.8125V13.5H13.8125V19.5H11.8125Z"
        fill={color ? "#FFFFFF" : "#01071A"}
      />
    </g>
  </svg>
);
