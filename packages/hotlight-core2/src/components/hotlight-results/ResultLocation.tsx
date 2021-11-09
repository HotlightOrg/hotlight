import { FunctionalComponent, h } from '@stencil/core';
import { Trigger } from "../hotlight-modal/hotlight-modal";
import { triggerIcon } from "../../utils/utils";

interface ResultLocationProps {
  trigger: Trigger;
}

export const ResultLocation: FunctionalComponent<ResultLocationProps> = ({ trigger }) => {
  const { icon, path } = triggerIcon(trigger);
  return (
    <span class="trigger-location">{icon} - {path}</span>
  );
}
