import * as React from "react"
import { useBookingStore } from "../../store/useBookingStore"
import { Input } from "@/components/atoms/ui/input"
import { Label } from "@/components/atoms/ui/label"
import { Textarea } from "@/components/atoms/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/atoms/ui/card"
import { Button } from "@/components/atoms/ui/button"
import { Loader2 } from "lucide-react"
import { ThemeToggle } from "../atoms/ui/ThemeToggle"
import { LanguageToggle } from "../atoms/ui/LanguageToggle"
import { useTranslation } from "@/lib/i18n/useTranslation"
import toursData from "../../data/tours.json"

export function BookingForm() {
  const { t, language } = useTranslation()
  const { formData, selectedDate, updateFormData, prevStep } = useBookingStore() as any
  const [isLoading, setIsLoading] = React.useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement
    let processedValue: string | number | boolean = value
    
    if (type === "checkbox") {
      processedValue = (e.target as HTMLInputElement).checked
    } else if (name === "guests") {
      const numValue = parseInt(value, 10)
      processedValue = isNaN(numValue) ? 0 : Math.min(numValue, 30)
    }

    updateFormData({ [name]: processedValue })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.privacyAccepted) {
      alert(t.errors.privacyRequired)
      return
    }

    setIsLoading(true)

    try {
      const selectedTour = toursData.find(t => t.id === formData.tourId)
      if (!selectedTour) {
        throw new Error(t.errors.tourRequired)
      }

      const tourTitle = typeof selectedTour.title === 'string' 
        ? selectedTour.title 
        : (selectedTour.title[language] || selectedTour.title.es)

      const payload = {
        url: import.meta.env.PUBLIC_RETURN_URL,
        url_success: import.meta.env.PUBLIC_SUCCESS_URL,
        user: import.meta.env.PUBLIC_STRIPE_USER,
        currency: "eur",
        products: {
          [tourTitle]: {
            description: `
              ${t.stripe.name}: ${formData.fullName}
              ${t.stripe.email}: ${formData.email}
              ${t.stripe.tour}: ${tourTitle}
              ${t.stripe.date}: ${selectedDate?.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US') || t.stripe.notSpecified}
              ${t.stripe.guests}: ${formData.guests}
              ${t.stripe.requests}: ${formData.specialRequests || t.stripe.none}
            `.trim().replace(/\s+/g, ' '),
            image_url: import.meta.env.PUBLIC_STRIPE_IMAGE_URL,
            price: selectedTour.price,
            amount: 1
          }
        }
      }

      const response = await fetch(import.meta.env.PUBLIC_STRIPE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(t.errors.processingError)
      }

      const data = await response.json()
      if (data.stripe_url) {
        window.open(data.stripe_url, '_blank');
        window.location.reload();
      } else {
        throw new Error(t.errors.noPaymentUrl)
      }
    } catch (error) {
      console.error('Error submitting booking:', error)
      alert(error instanceof Error ? error.message : `${t.errors.processingError}. ${t.errors.tryAgain}`)
      setIsLoading(false)
    }
  }

  return (
    <form 
      onSubmit={handleSubmit}
      className="flex flex-col p-4 bg-muted/30 space-y-4 rounded-3xl border border-border h-full w-full"
    >
      <Card className="w-full shadow-xl border-none bg-background flex-1 relative">
        <div className="absolute top-2 right-2 z-20 scale-75 lg:scale-100 flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-serif text-foreground">{t.form.title}</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            {t.form.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="fullName" className="text-xs text-foreground">{t.form.fullName}</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder={t.form.fullNamePlaceholder}
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="h-9 text-sm"
                  required
                />
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="email" className="text-xs text-foreground">{t.form.email}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={t.form.emailPlaceholder}
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="h-9 text-sm"
                  required
                />
              </div>
            </div>

            <div className="grid gap-1.5 w-full md:w-1/2">
              <Label htmlFor="guests" className="text-xs text-foreground">{t.form.guests}</Label>
              <Input
                id="guests"
                name="guests"
                type="number"
                min="1"
                max="30"
                value={formData.guests}
                onChange={handleChange}
                disabled={isLoading}
                className="h-9 text-sm"
                required
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="specialRequests" className="text-xs text-foreground">{t.form.specialRequests}</Label>
              <Textarea
                id="specialRequests"
                name="specialRequests"
                placeholder={t.form.specialRequestsPlaceholder}
                value={formData.specialRequests}
                onChange={handleChange}
                disabled={isLoading}
                className="text-sm min-h-[80px]"
                rows={3}
              />
            </div>

            <div className="flex items-start space-x-2 pt-2">
              <input
                type="checkbox"
                id="privacyAccepted"
                name="privacyAccepted"
                checked={formData.privacyAccepted}
                onChange={handleChange}
                className="mt-0.5 h-4 w-4 rounded border-input bg-background text-primary focus:ring-primary cursor-pointer transition-colors"
                required
              />
              <Label 
                htmlFor="privacyAccepted" 
                className="text-xs peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-muted-foreground"
              >
                {t.form.privacyPolicy.split('política de privacidad')[0]}
                <a href="https://granadago.com/privacidad/" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:opacity-80 transition-opacity">
                  {language === 'es' ? 'política de privacidad' : 'privacy policy'}
                </a>
                {t.form.privacyPolicy.split('política de privacidad')[1] || (language === 'en' ? '.' : '')}
              </Label>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <Button 
                variant="outline" 
                className="py-5 font-serif rounded-xl"
                onClick={prevStep}
                type="button"
                disabled={isLoading}
              >
                {t.form.back}
              </Button>
              <Button 
                className="py-5 font-serif rounded-xl"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t.form.processing}
                  </>
                ) : (
                  t.form.submit
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="text-center text-white text-[10px] font-sans italic px-4 pb-2">
        <p>{t.form.requiredFields}</p>
      </div>
    </form>
  )
}
