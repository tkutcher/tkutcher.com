import { animate, state, style, transition, trigger } from "@angular/animations";
import { BG_MID, matElevationZ8 } from "../../general/styling-consts";

export enum HeaderAppearanceState {
  Transparent = "Transparent",
  Floating = "Floating",
  Gone = "Gone",
}

export const headerAppearanceAnimation = trigger("headerAppearance", [
  state(
    HeaderAppearanceState.Transparent,
    style({
      backgroundColor: "transparent",
      boxShadow: "none",
    })
  ),
  state(
    HeaderAppearanceState.Floating,
    style({
      backgroundColor: BG_MID,
      opacity: 0.98,
      boxShadow: matElevationZ8,
    })
  ),
  transition("* <=> *", animate("300ms ease-in-out")),
]);
