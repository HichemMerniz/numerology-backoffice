import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// import { getNumerologyData } from "../../services/api";

const NumerologyForm = () => {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async () => {
    // const data = await getNumerologyData(name, dob);
    // setResult(data);
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Numerology Calculator</h2>
      <Input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
      <Input type="date" placeholder="Date of Birth" value={dob} onChange={(e) => setDob(e.target.value)} />
      <Button onClick={handleSubmit}>Calculate</Button>
      {result && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Results:</h3>
          <p>Life Path Number: {result.lifePath}</p>
          <p>Expression Number: {result.expression}</p>
          <p>Soul Urge Number: {result.soulUrge}</p>
        </div>
      )}
    </div>
  );
};

export default NumerologyForm;