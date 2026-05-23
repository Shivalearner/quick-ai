import { Image, Sparkles } from "lucide-react";
import { useState } from "react";
const GenerateImages = () => {
  const imageStyle = [
    "Realistic",
    "Ghibili style",
    "Anime style",
    "Cartoon style",
    "Fantasy style",
    "Realistic style",
    "3D style",
    "Portrait style",
  ];

  // State Variable
  const [selectedStyle, setselectedStyle] = useState("Realistic");
  const [input, setInput] = useState("");
  const [publish, setPublish] = useState(false);
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
          <Sparkles className="w-6 text-[#00AD25]" />
          <h1 className="text-xl font-semibold">AI Image Generator</h1>
        </div>
        <p className="mt-6 text-sm font-medium">Describe Your Image</p>

        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          rows={4}
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300"
          placeholder="Describe what you want to see in the image..."
          required
        />
        <p className="mt-4 text-sm font-medium">Style</p>

        <div className="mt-3   flex gap-3 flex-wrap sm:max-w-10/11">
          {imageStyle.map((item) => (
            <span
              onClick={() => {
                setselectedStyle(item);
              }}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${selectedStyle === item ? "bg-green-50 text-green-700" : "text-gray-500 border-gray-200"}`}
              key={item}
            >
              {item}
            </span>
          ))}
        </div>
        <div className="my-6 flex items-center gap-2">
          <label className="relative cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={publish}
              onChange={() => setPublish(event.target.checked)}
            />
            <div className="w-9  h-5 bg-slate-300 rounded-full peer-checked:bg-green-500 transition"></div>
            <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition peer-checked:translate-x-4"></span>
          </label>

          <p className="text-sm">Make this image public</p>
        </div>

        <button className="flex w-full justify-center items-center gap-2 bg-gradient-to-r from-[#00AD25] to-[#04FF50] text-white px-4 py-2 text-sm rounded-lg cursor-pointer">
          <Image className="w-5 " />
          Generate Image
        </button>
      </form>

      {/* Right col */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 ">
        <div className="flex items-center gap-3">
          <Image className="w-5 h-5 text-[#00AD25]" />
          <h1 className="text-xl font-semibold">Generated Image</h1>
        </div>
        <div className="flex-1 flex justify-center items-center">
          <div className="text-sm flex flex-col items-center gap-3 text-gray-400">
            <Image className="w-9 h-9" />
            <p>Select a Style and click "Generate Image" to get Started</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateImages;
