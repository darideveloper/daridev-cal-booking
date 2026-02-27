import * as React from "react"
import { useBookingStore } from "../../store/useBookingStore"
import { Input } from "@/components/atoms/ui/input"
import { Label } from "@/components/atoms/ui/label"
import { Textarea } from "@/components/atoms/ui/textarea"
import { Select } from "@/components/atoms/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/atoms/ui/card"
import { Button } from "@/components/atoms/ui/button"
import toursData from "@/data/tours.json"

interface BookingFormProps {
  initialTourId?: string
}

export function BookingForm({ initialTourId }: BookingFormProps) {
  const { formData, updateFormData, prevStep } = useBookingStore() as any

  React.useEffect(() => {
    if (initialTourId) {
      updateFormData({ tourId: initialTourId })
    }
  }, [initialTourId, updateFormData])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    let processedValue: string | number = value
    
    if (name === "guests") {
      const numValue = parseInt(value, 10)
      processedValue = isNaN(numValue) ? 0 : Math.min(numValue, 30)
    }

    updateFormData({ [name]: processedValue })
  }

  return (
    <div className="flex flex-col p-4 bg-muted/30 space-y-4 rounded-3xl border border-border h-full w-full">
      <Card className="w-full shadow-xl border-none bg-background flex-1">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-red px-2 py-0.5 bg-brand-red/10 rounded-full">
              Paso 2 de 2
            </span>
          </div>
          <CardTitle className="text-xl font-serif text-brand-charcoal">Datos de la reserva</CardTitle>
          <CardDescription className="text-xs text-brand-charcoal/60">
            Completa tus datos para finalizar la solicitud.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="fullName" className="text-xs">Nombre Completo</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="Tu nombre"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="h-9 text-sm"
                  required
                />
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="email" className="text-xs">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="h-9 text-sm"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 grid gap-1.5">
                <Label htmlFor="tourId" className="text-xs">Tour</Label>
                <Select
                  id="tourId"
                  name="tourId"
                  value={formData.tourId || ""}
                  onChange={handleChange}
                  className="h-9 text-sm"
                  required
                >
                  <option value="" disabled>Selecciona un tour</option>
                  {toursData.map((tour: any) => (
                    <option key={tour.id} value={tour.id}>
                      {tour.title}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="guests" className="text-xs">Personas</Label>
                <Input
                  id="guests"
                  name="guests"
                  type="number"
                  min="1"
                  max="30"
                  value={formData.guests}
                  onChange={handleChange}
                  className="h-9 text-sm"
                  required
                />
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="specialRequests" className="text-xs">Peticiones especiales (opcional)</Label>
              <Textarea
                id="specialRequests"
                name="specialRequests"
                placeholder="Cuéntanos si necesitas algo especial..."
                value={formData.specialRequests}
                onChange={handleChange}
                className="text-sm min-h-[80px]"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <Button 
                variant="outline" 
                className="py-5 font-serif rounded-xl"
                onClick={prevStep}
              >
                Volver
              </Button>
              <Button 
                className="py-5 font-serif rounded-xl"
                type="submit"
              >
                Solicitar Reserva
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="text-center text-foreground/40 text-[10px] font-sans italic px-4 pb-2">
        <p>Todos los campos marcados son obligatorios para procesar su solicitud.</p>
      </div>
    </div>
  )
}
