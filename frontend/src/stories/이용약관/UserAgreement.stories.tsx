import { Meta, StoryObj } from "@storybook/react";
import UserAgreement from "@/widgets/join-dialog/ui/UserAgreement";
import { Dialog } from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const meta: Meta = {
  title: "이용약관동의/팝업",
  component: () => {
    const [open, setOpen] = useState(false);

    return (
      <div>
        <Button onClick={() => setOpen(true)}>열기</Button>
        <Dialog open={open}>
          <UserAgreement
            handleClose={() => setOpen(false)}
            nextStep={() => {}}
          />
        </Dialog>
      </div>
    );
  },
};

export default meta;

type Story = StoryObj<typeof UserAgreement>;

export const DefaultStory: Story = {};
