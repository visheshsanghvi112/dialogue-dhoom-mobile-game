
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

interface RoomCodeProps {
  code: string;
}

const RoomCode = ({ code }: RoomCodeProps) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast({
      title: "Room Code Copied!",
      description: "Share this code with your friends to join the game.",
    });

    // Reset copied state after 2 seconds
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bollywood-card flex flex-col items-center p-6 my-4">
      <p className="text-sm text-bollywood-tertiary mb-1">Room Code</p>
      <div className="flex items-center gap-2">
        <h2 className="text-3xl font-bold tracking-wider text-bollywood-primary">
          {code.split("").join(" ")}
        </h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={copyToClipboard} 
          className={`ml-2 ${copied ? 'bg-green-50 text-green-600' : ''}`}
        >
          <Copy size={16} className="mr-1" />
          {copied ? "Copied!" : "Copy"}
        </Button>
      </div>
      <p className="text-xs text-gray-500 mt-2">Share this code with friends to join</p>
    </div>
  );
};

export default RoomCode;
