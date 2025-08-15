export default function Sell() {
  return (
    <>
      <div
        className="flex"
        style={{
          margin: 10,
          backgroundColor: 'black',
          width: 422,
          height: 100,
          borderRadius: 10,
        }}
      />

      {/* amounts */}
      <div className="flex">
        {['$10', '$20', '$50', '$100', 'MAX'].map((item) => {
          return (
            <div
              key={item}
              className="flex"
              style={{
                backgroundColor: 'black',
                marginLeft: 10,
                width: 75,
                height: 30,
                borderRadius: 10,
              }}
            >
              <button
                className="flex-1 items-center justify-center"
                style={{
                  backgroundColor: '#121116',
                  borderRadius: 10,
                  margin: 2,
                  color: 'grey',
                }}
                type="button"
              >
                {item}
              </button>
            </div>
          );
        })}
      </div>

      {/* buy/sell button */}
      <div
        className="flex bg-deep_purple-A700"
        style={{ margin: 10, width: 422, height: 50, borderRadius: 10 }}
      >
        <button
          className="flex flex-1 items-center justify-center"
          type="button"
        >
          Sell
        </button>
      </div>
    </>
  );
}
