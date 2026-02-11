import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category } from "@/types";

type CategorySelectProps = {
  value: string;
  onChange: (value: string) => void;
  categories: Category[];
  error?: string;
  required?: boolean;
};

export const CategorySelect: React.FC<CategorySelectProps> = ({
  value,
  onChange,
  categories,
  error,
  required,
}) => (
  <div className="space-y-2">
    <Label>
      Category{required && <span className="text-red-500"> *</span>}
    </Label>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={error ? "border-red-500" : ""}>
        <SelectValue placeholder="Select category" />
      </SelectTrigger>
      <SelectContent>
        {categories.map((category) => (
          <SelectItem key={category.id} value={category.id}>
            <div className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <span>{category.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
);
