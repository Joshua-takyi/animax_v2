"use client";
import { GetCharacterInfo } from "@/action";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown, Info, Mic } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Define interfaces for better type safety
interface VoiceActor {
  person: {
    images: {
      jpg: {
        image_url: string;
      };
    };
    name: string;
    language: string;
  };
}

interface Character {
  mal_id: number;
  images: {
    jpg: {
      image_url: string;
    };
  };
  name: string;
}

interface CharactersProps {
  character: Character;
  role: string;
  voice_actors: VoiceActor[];
}

// Enhanced character card with improved design
const CharacterCard = ({
  CharacterImage,
  characterName,
  voiceActorImage,
  role,
  voiceActor,
  language,
}: {
  CharacterImage: string;
  characterName: string;
  role: string;
  voiceActorImage: string | undefined;
  voiceActor: string | undefined;
  language: string | undefined;
}) => {
  // Use useState to track if the card is flipped to show more details
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <Card
      className={`
        group relative overflow-hidden transition-all duration-300 
        backdrop-blur-sm bg-background/80 border-none
        shadow hover:shadow-md rounded-xl
        ${
          isFlipped
            ? "ring-1 ring-primary/40"
            : "ring-1 ring-border/10 hover:ring-primary/20"
        }
      `}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className="absolute top-0 right-0 m-1.5 z-10">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge
                variant="secondary"
                className={`
                  px-1.5 py-0 text-[10px] font-medium uppercase tracking-wider
                  bg-primary/10 hover:bg-primary/20 text-primary backdrop-blur-md
                  transition-all duration-300
                `}
              >
                {role}
              </Badge>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p className="text-xs">Character Role</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="p-2 sm:p-3 h-full flex flex-col">
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Character section with properly sized image */}
          <div className="relative flex-shrink-0">
            <div
              className={`
                relative w-14 h-16 sm:w-16 sm:h-20 overflow-hidden rounded-lg transition-transform
                duration-300 group-hover:scale-105
                ${
                  isFlipped ? "ring-1 ring-primary/30" : "ring-1 ring-border/10"
                }
              `}
            >
              <Image
                alt={characterName}
                src={CharacterImage}
                fill
                sizes="(max-width: 640px) 56px, 64px"
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Character info with enhanced styling */}
          <div className="flex-1 min-w-0">
            <h3
              className="text-sm sm:text-base font-medium leading-tight mb-0.5
                         bg-gradient-to-r from-foreground to-foreground/70
                         bg-clip-text text-transparent truncate"
            >
              {characterName}
            </h3>

            <div className="flex items-center space-x-1 mt-0.5">
              <Info className="h-2.5 w-2.5 text-muted-foreground" />
              <span className="text-[10px] sm:text-xs text-muted-foreground">
                Character
              </span>
            </div>

            {/* Animated divider */}
            <div className="my-1.5 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent opacity-30"></div>

            {/* Voice actor section */}
            {voiceActor && (
              <div className="flex items-center space-x-2 mt-1.5">
                <div className="flex-shrink-0">
                  {voiceActorImage ? (
                    <Avatar
                      className={`
                        h-7 w-7 sm:h-8 sm:w-8 border-2 border-background 
                        ring-1 ring-border/10 
                        transition-transform duration-300 group-hover:scale-105
                      `}
                    >
                      <AvatarImage src={voiceActorImage} alt={voiceActor} />
                      <AvatarFallback className="text-[8px] sm:text-xs bg-primary/10 text-primary">
                        {voiceActor.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Mic className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-xs sm:text-sm leading-none truncate">
                    {voiceActor}
                  </p>
                  {language && (
                    <Badge
                      variant="outline"
                      className="mt-0.5 text-[8px] px-1 py-0 bg-secondary/10 border-none text-secondary-foreground"
                    >
                      {language}
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {!voiceActor && (
              <div className="flex items-center space-x-1.5 mt-1.5 text-muted-foreground">
                <Mic className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                <span className="text-[10px] sm:text-xs italic">
                  No voice actor data
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Interactive indicator */}
        <div className="absolute bottom-1 right-1">
          <div
            className={`
            h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full transition-colors duration-300
            ${isFlipped ? "bg-primary" : "bg-muted-foreground/30"}
          `}
          ></div>
        </div>
      </div>
    </Card>
  );
};

export const CharacterComponent = () => {
  const params = useParams();
  const id = params.id as string;
  const initialLimit = 6;
  const maxLimit = 24; // Reduced from 50 for better performance
  const [showAll, setShowAll] = useState(false);

  // Query for character data
  const { data, isLoading, error } = useQuery({
    queryKey: ["characters", id],
    queryFn: async () => {
      const res = await GetCharacterInfo({
        id: id,
      });
      return res.data as CharactersProps[];
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div className="h-4 sm:h-5 bg-muted rounded w-24 sm:w-32 animate-pulse"></div>
          <div className="h-6 sm:h-7 bg-muted rounded w-16 sm:w-20 animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-3 rounded-lg bg-muted/50 animate-pulse">
              <div className="flex items-start space-x-2 sm:space-x-3">
                <div className="w-14 h-16 sm:w-16 sm:h-20 rounded-lg bg-muted"></div>
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 sm:h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-2 bg-muted rounded w-1/2"></div>
                  <div className="h-px bg-muted rounded w-full my-1.5"></div>
                  <div className="flex items-center space-x-2">
                    <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-muted"></div>
                    <div className="space-y-1 flex-1">
                      <div className="h-2.5 sm:h-3 bg-muted rounded w-2/3"></div>
                      <div className="h-1.5 sm:h-2 bg-muted rounded w-1/3"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-3 sm:p-4 rounded-lg bg-destructive/5 border border-destructive/10 text-destructive text-xs sm:text-sm">
        <p>Error loading character data: {(error as Error).message}</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="p-4 sm:p-6 rounded-lg bg-muted/50 text-muted-foreground text-center text-xs sm:text-sm">
        <p>No character information available for this anime.</p>
      </div>
    );
  }

  // Process data for display
  const processedData = data?.slice(0, maxLimit);
  const hasMore = processedData.length > initialLimit;
  const visibleData = showAll
    ? processedData
    : processedData.slice(0, initialLimit);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b border-border/30 pb-2">
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          <div className="h-6 sm:h-8 w-0.5 sm:w-1 bg-gradient-to-b from-primary to-primary/20 rounded-full"></div>
          <h2 className="text-base sm:text-lg font-medium bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Characters & VA
          </h2>
        </div>

        {hasMore && (
          <Button
            onClick={() => setShowAll(!showAll)}
            variant="outline"
            size="sm"
            className="text-[10px] sm:text-xs border border-border/30 py-0.5 h-7 hover:bg-primary/5 hover:text-primary transition-colors"
          >
            {showAll ? (
              <ChevronUp className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1" />
            ) : (
              <ChevronDown className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1" />
            )}
            {showAll ? "Show Less" : "Show More"}
          </Button>
        )}
      </div>

      {/* Grid with a responsive layout that adapts to screen size */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
        {visibleData.map((character: CharactersProps, index: number) => (
          <CharacterCard
            key={`${character.character.mal_id}-${index}`}
            CharacterImage={character.character.images.jpg.image_url}
            characterName={character.character.name}
            role={character.role}
            voiceActorImage={
              character.voice_actors[0]?.person.images.jpg.image_url
            }
            voiceActor={character.voice_actors[0]?.person.name}
            language={character.voice_actors[0]?.person.language}
          />
        ))}
      </div>

      {hasMore && showAll && (
        <div className="flex justify-center mt-3 sm:mt-4">
          <Button
            onClick={() => setShowAll(false)}
            variant="outline"
            size="sm"
            className="text-[10px] sm:text-xs border border-border/30 py-0.5 h-7 hover:bg-primary/5 hover:text-primary transition-colors"
          >
            Show Less
            <ChevronUp className="ml-1 h-3 w-3 sm:h-3.5 sm:w-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
};
