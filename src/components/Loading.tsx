import "./Loading.css";

export default function Loading() {
  return (
    <div className="gdsc-loading">
      <div className="bounce">
        <div className="loader-bounce bounce-blue"></div>
        <div className="loader-bounce bounce-red"></div>
        <div className="loader-bounce bounce-yellow"></div>
        <div className="loader-bounce bounce-green"></div>
      </div>
    </div>
  );
}
