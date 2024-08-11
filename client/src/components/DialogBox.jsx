import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "./ui/button";

export const DialogBoxPlaylist = () => {
  return (
    <div>
      <DialogContent className="flex flex-col gap-5 justify-center w-2/3 sm:1/2 md:w-2/5 lg:1/4 bg-gray-200 border-black">
        <DialogHeader>
          <DialogTitle>Select Playlist</DialogTitle>
        </DialogHeader>
        <DialogDescription className="flex gap-10 flex-col items-center">
          <Select >
            <SelectTrigger className="w-full border-black focus:outline-none focus:ring-0 bg-transparent" >
              <SelectValue placeholder="Playlist..." />
            </SelectTrigger>
            <SelectContent className="max-h-48 bg-gray-200">
              <SelectItem value="watchLater">Watch Later</SelectItem>
              <SelectItem value="playlist1">Playlist 1</SelectItem>
              <SelectItem value="playlist2">Playlist 2</SelectItem>
              <SelectItem value="playlist3">Playlist 3</SelectItem>
              <SelectItem value="playlist4">Playlist 4</SelectItem>
              <SelectItem value="playlist6">Playlist 5</SelectItem>
              <SelectItem value="playlist5">Playlist 6</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit" className="w-1/2">
            Confirm
          </Button>
        </DialogDescription>
      </DialogContent>
    </div>
  );
};

