export default function ContactCard() {
  return (
    <div className="bg-[#FDEFEA] rounded-2xl p-10 text-center mt-14">

      <h2 className="text-4xl font-bold text-[#1B1B2F]">
        Contact CargoConnect
      </h2>

      <div className="mt-8 space-y-4 text-slate-700">

        <p>
          404, Sumero Heights,
          <br />
          Ahmedabad, Gujarat
        </p>

        <p>
          <span className="font-semibold">
            Helpline:
          </span>{" "}
          +91 98765 43210
        </p>

        <p>
          <span className="font-semibold">
            Email:
          </span>{" "}
          support@cargoconnect.com
        </p>

      </div>

    </div>
  );
}