import { type Dispatch, type SetStateAction, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  type BarcodeBabaProfile,
  type ProfileDiet,
  getProfile,
  profileExists,
  saveProfile,
} from "@/utils/profile";

const allergyOptions = [
  "None",
  "Lactose intolerance",
  "Peanut allergy",
  "Gluten allergy",
  "Soy allergy",
  "Tree nut allergy",
] as const;

const healthConditionOptions = [
  "None",
  "Diabetes",
  "Heart disease",
  "Hypertension",
  "High cholesterol",
] as const;

interface ProfileSetupModalProps {
  forceOpen?: boolean;
  onClose?: () => void;
}

export function ProfileSetupModal({ forceOpen = false, onClose }: ProfileSetupModalProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [allergies, setAllergies] = useState<string[]>([]);
  const [diet, setDiet] = useState<ProfileDiet>("none");
  const [healthConditions, setHealthConditions] = useState<string[]>([]);

  useEffect(() => {
    if (forceOpen) {
      const existingProfile = getProfile();
      setName(existingProfile?.name ?? "");
      setAllergies(existingProfile?.allergies ?? []);
      setDiet(existingProfile?.diet ?? "none");
      setHealthConditions(existingProfile?.healthConditions ?? []);
      setOpen(true);
      return;
    }

    if (!profileExists()) {
      setOpen(true);
    }
  }, [forceOpen]);

  const profile = useMemo<BarcodeBabaProfile>(
    () => ({ name: name.trim(), allergies, diet, healthConditions }),
    [name, allergies, diet, healthConditions],
  );

  const onMultiSelectToggle = (
    value: string,
    checked: boolean,
    selected: string[],
    setSelected: Dispatch<SetStateAction<string[]>>,
  ) => {
    if (value === "None") {
      setSelected(checked ? ["None"] : []);
      return;
    }

    setSelected(() => {
      const withoutNone = selected.filter((item) => item !== "None");
      if (checked) return [...withoutNone, value];
      return withoutNone.filter((item) => item !== value);
    });
  };

  const handleSave = () => {
    saveProfile(profile);
    setOpen(false);
    onClose?.();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-3 sm:p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] flex flex-col border-2 border-[#FFC107] shadow-2xl">
        <div className="p-4 border-b">
          <h2 className="text-2xl font-display font-bold text-foreground">Personal Food Safety Profile</h2>
        </div>

        <div className="overflow-y-auto p-4 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="profile-name" className="text-lg font-semibold text-foreground">
              What is your name?
            </Label>
            <input
              id="profile-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full rounded-lg border border-[#FFC107]/40 px-3 py-3 text-lg bg-[#FFF8E1] text-foreground"
            />
          </div>

          <div className="space-y-3">
            <p className="text-lg font-semibold text-foreground">Do you have any food allergies?</p>
            <div className="grid grid-cols-1 gap-3">
              {allergyOptions.map((option) => (
                <label key={option} className="flex items-center gap-3 rounded-lg border border-[#FFC107]/40 p-3 text-lg font-medium bg-[#FFF8E1]">
                  <Checkbox
                    checked={allergies.includes(option)}
                    onCheckedChange={(checked) =>
                      onMultiSelectToggle(option, checked === true, allergies, setAllergies)
                    }
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-lg font-semibold text-foreground">Do you follow any dietary preference?</p>
            <RadioGroup value={diet} onValueChange={(value) => setDiet(value as ProfileDiet)} className="space-y-3">
              {[
                { value: "none", label: "None" },
                { value: "vegetarian", label: "Vegetarian" },
                { value: "vegan", label: "Vegan" },
              ].map((option) => (
                <div key={option.value} className="flex items-center gap-3 rounded-lg border border-[#FFC107]/40 p-3 bg-[#FFF8E1]">
                  <RadioGroupItem value={option.value} id={`diet-${option.value}`} />
                  <Label htmlFor={`diet-${option.value}`} className="text-lg text-foreground">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <p className="text-lg font-semibold text-foreground">Do you have any health conditions?</p>
            <div className="grid grid-cols-1 gap-3">
              {healthConditionOptions.map((option) => (
                <label key={option} className="flex items-center gap-3 rounded-lg border border-[#FFC107]/40 p-3 text-lg font-medium bg-[#FFF8E1]">
                  <Checkbox
                    checked={healthConditions.includes(option)}
                    onCheckedChange={(checked) =>
                      onMultiSelectToggle(option, checked === true, healthConditions, setHealthConditions)
                    }
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t">
          <Button
            onClick={handleSave}
            className="w-full rounded-lg px-8 py-6 text-lg font-bold bg-[#FFC107] text-[#1A1A1A] hover:bg-[#ffca2b]"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
