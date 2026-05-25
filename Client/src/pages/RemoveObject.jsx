import { useState } from "react";
import { Scissors, Sparkles } from "lucide-react";
const RemoveObject = () => {
  const [input, setInput] = useState("");
  const [object, setObject] = useState("");

  const onSubmitHandler = async (event) => {
    event.preventDefault();
  };
  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
      {/* Left col */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#4A7AFF]" />
          <h1 className="text-xl font-semibold">Object Removal</h1>
        </div>
        <p className="mt-6 text-sm font-medium">Upload Image</p>

        <input
        
          accept="image/*"
          onChange={(event) => setInput(event.target.files[0])}
          type="file"
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600"
          required
        />
        <p className="mt-6 text-sm font-medium">
          Describe object name to remove
        </p>

        <textarea
          value={object}
          onChange={(event) => setObject(event.target.value)}
          rows={4}
          className="w-full p-2 px-3 mb-4 mt-2 outline-none text-sm rounded-md border border-gray-300"
          placeholder="e.g., watch or spoon, Only single object name"
          required
        />

        <button className="flex w-full justify-center items-center gap-2 bg-gradient-to-r from-[#417DF6] to-[#8E37EB] text-white px-4 py-2 text-sm rounded-lg cursor-pointer">
          <Scissors className="w-5 " />
          Remove Object
        </button>
      </form>

      {/* Right col */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 ">
        <div className="flex items-center gap-3">
          <Scissors className="w-5 h-5 text-[#4A7AFF]" />
          <h1 className="text-xl font-semibold">Processed Image</h1>
        </div>
        <div className="flex-1 flex justify-center items-center">
          <div className="text-sm flex flex-col items-center gap-3 text-gray-400">
            <Scissors className="w-9 h-9" />
            <p>Upload an image and click "Remove Object" to get started</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemoveObject;
