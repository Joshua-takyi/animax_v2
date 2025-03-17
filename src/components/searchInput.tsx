import { SearchIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useCallback, FormEvent, KeyboardEvent, RefObject } from 'react';

interface SearchInputProps {
  placeholder?: string;
  className?: string;
  inputRef?: RefObject<HTMLInputElement>;
  onClose?: () => void;
}

export default function SearchInput({
  placeholder = 'Search for movies...',
  className = '',
  inputRef,
  onClose,
}: SearchInputProps) {
  const [search, setSearch] = useState<string>('');
  const router = useRouter();

  const handleRedirect = useCallback(() => {
    const trimmedSearch = search.trim();
    if (trimmedSearch.length === 0) return;

    const sanitizedSearch = trimmedSearch.replace(/[<>]/g, '');
    router.push(`/search?q=${encodeURIComponent(sanitizedSearch)}`);

    // Close search dropdown when navigating
    onClose?.();
  }, [search, router, onClose]);

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      handleRedirect();
    },
    [handleRedirect]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleRedirect();
      } else if (e.key === 'Escape' && onClose) {
        e.preventDefault();
        onClose();
      }
    },
    [handleRedirect, onClose]
  );

  return (
    <form
      className={`${className} relative w-full max-w-[95%] sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto`}
      onSubmit={handleSubmit}
      role="search"
    >
      <div className="relative flex items-center w-full">
        <input
          ref={inputRef}
          type="text"
          name="search"
          className="w-full px-3 sm:px-4 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors dark:text-white dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400"
          placeholder={placeholder}
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />
        <button
          type="submit"
          className="absolute right-1 sm:right-2 p-1 sm:p-2 text-gray-500 hover:text-primary transition-colors rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={handleRedirect}
          aria-label="Search"
        >
          <SearchIcon size={18} className="sm:hidden" />
          <SearchIcon size={20} className="hidden sm:block" />
        </button>
      </div>
    </form>
  );
}
