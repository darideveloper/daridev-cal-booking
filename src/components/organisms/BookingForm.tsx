import * as React from "react"
import { useBookingStore } from "@/store/useBookingStore"
import { Input } from "@/components/atoms/ui/input"
import { Label } from "@/components/atoms/ui/label"
import { Textarea } from "@/components/atoms/ui/textarea"
import { Select } from "@/components/atoms/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/atoms/ui/card"
import toursData from "@/data/tours.json"

interface BookingFormProps {
  initialTourId?: string
}

export function BookingForm({ initialTourId }: BookingFormProps) {
  const { formData, updateFormData } = useBookingStore()

  React.useEffect(() => {
    if (initialTourId) {
      updateFormData({ tourId: initialTourId })
    }
  }, [initialTourId, updateFormData])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    updateFormData({ [name]: name === "guests" ? parseInt(value, 10) : value })
  }

  return (
    <div className="flex flex-col p-4 bg-muted/30 space-y-6 rounded-3xl border border-border h-full">
      <Card className="w-full shadow-xl border-none bg-background flex-1">
        <CardHeader>
          <CardTitle className="text-2xl font-serif text-brand-charcoal">Reserva tu experiencia</CardTitle>
          <CardDescription className="text-sm text-brand-charcoal/60">
            Completa tus datos para solicitar una reserva.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="fullName">Nombre Completo</Label>
              <Input
                id="fullName"
                name="fullName"
                placeholder="Tu nombre"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tourId">Tour</Label>
              <Select
                id="tourId"
                name="tourId"
                value={formData.tourId || ""}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Selecciona un tour</option>
                {toursData.map((tour) => (
                  <option key={tour.id} value={tour.id}>
                    {tour.title}
                  </option>
                ))}
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="guests">Número de personas</Label>
              <Input
                id="guests"
                name="guests"
                type="number"
                min="1"
                max="20"
                value={formData.guests}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="specialRequests">Peticiones especiales (opcional)</Label>
              <Textarea
                id="specialRequests"
                name="specialRequests"
                placeholder="Cuéntanos si necesitas algo especial..."
                value={formData.specialRequests}
                onChange={handleChange}
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="text-center text-foreground/40 text-xs font-sans italic px-4 pb-2">
        <p>Todos los campos marcados son obligatorios para procesar su solicitud.</p>
      </div>
    </div>
  )
}
