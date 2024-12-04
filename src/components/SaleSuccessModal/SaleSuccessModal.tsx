import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button"; // Botão do Shadcn UI

export function SaleSuccessModal({ saleId, isOpen, onClose }: { saleId: number; isOpen: boolean; onClose: () => void }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTrigger />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Venda Realizada com Sucesso!</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          A venda foi concluída com sucesso. O ID da venda é: {saleId}.
        </DialogDescription>
        <DialogFooter>
          <Button onClick={onClose}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
