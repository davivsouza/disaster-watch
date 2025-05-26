"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Bell, Mail, MessageSquare, MapPin, Shield, ArrowLeft, Plus, Trash2, AlertTriangle } from "lucide-react"
import Link from "next/link"

interface AlertRule {
  id: string
  name: string
  location: string
  disasterTypes: string[]
  severity: string[]
  notificationMethods: string[]
  isActive: boolean
}

export default function AlertsPage() {
  const [alertRules, setAlertRules] = useState<AlertRule[]>([
    {
      id: "1",
      name: "Alertas São Paulo",
      location: "São Paulo, Brasil",
      disasterTypes: ["earthquake", "flood"],
      severity: ["high", "critical"],
      notificationMethods: ["email", "sms"],
      isActive: true,
    },
    {
      id: "2",
      name: "Alertas Globais Críticos",
      location: "Global",
      disasterTypes: ["earthquake", "hurricane", "wildfire", "flood"],
      severity: ["critical"],
      notificationMethods: ["email", "push"],
      isActive: true,
    },
  ])

  const [newRule, setNewRule] = useState({
    name: "",
    location: "",
    disasterTypes: [] as string[],
    severity: [] as string[],
    notificationMethods: [] as string[],
  })

  const [showNewRuleForm, setShowNewRuleForm] = useState(false)

  const disasterTypeOptions = [
    { value: "earthquake", label: "Terremotos" },
    { value: "hurricane", label: "Furacões" },
    { value: "flood", label: "Enchentes" },
    { value: "wildfire", label: "Incêndios" },
    { value: "tornado", label: "Tornados" },
    { value: "heatwave", label: "Ondas de Calor" },
  ]

  const severityOptions = [
    { value: "low", label: "Baixa" },
    { value: "medium", label: "Média" },
    { value: "high", label: "Alta" },
    { value: "critical", label: "Crítica" },
  ]

  const notificationOptions = [
    { value: "email", label: "Email", icon: Mail },
    { value: "sms", label: "SMS", icon: MessageSquare },
    { value: "push", label: "Push", icon: Bell },
  ]

  const toggleRuleActive = (ruleId: string) => {
    setAlertRules((rules) => rules.map((rule) => (rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule)))
  }

  const deleteRule = (ruleId: string) => {
    setAlertRules((rules) => rules.filter((rule) => rule.id !== ruleId))
  }

  const addNewRule = () => {
    if (newRule.name && newRule.location) {
      const rule: AlertRule = {
        id: Date.now().toString(),
        ...newRule,
        isActive: true,
      }
      setAlertRules((rules) => [...rules, rule])
      setNewRule({
        name: "",
        location: "",
        disasterTypes: [],
        severity: [],
        notificationMethods: [],
      })
      setShowNewRuleForm(false)
    }
  }

  const toggleArrayValue = (array: string[], value: string, setter: (arr: string[]) => void) => {
    if (array.includes(value)) {
      setter(array.filter((item) => item !== value))
    } else {
      setter([...array, value])
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                <ArrowLeft className="h-5 w-5" />
                <span>Voltar</span>
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <Shield className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Configuração de Alertas</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Regras Ativas</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{alertRules.filter((rule) => rule.isActive).length}</div>
              <p className="text-xs text-muted-foreground">de {alertRules.length} regras totais</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Localizações</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{new Set(alertRules.map((rule) => rule.location)).size}</div>
              <p className="text-xs text-muted-foreground">regiões monitoradas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alertas Hoje</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">notificações enviadas</p>
            </CardContent>
          </Card>
        </div>

        {/* Alert Rules */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Regras de Alerta</CardTitle>
                <CardDescription>
                  Configure quando e como você quer ser notificado sobre desastres naturais
                </CardDescription>
              </div>
              <Button onClick={() => setShowNewRuleForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Regra
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {alertRules.map((rule) => (
              <div key={rule.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-medium">{rule.name}</h3>
                      <Badge variant={rule.isActive ? "default" : "secondary"}>
                        {rule.isActive ? "Ativa" : "Inativa"}
                      </Badge>
                    </div>

                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span>{rule.location}</span>
                      </div>

                      <div>
                        <span className="font-medium">Tipos: </span>
                        {rule.disasterTypes
                          .map((type) => {
                            const option = disasterTypeOptions.find((opt) => opt.value === type)
                            return option?.label
                          })
                          .join(", ")}
                      </div>

                      <div>
                        <span className="font-medium">Severidade: </span>
                        {rule.severity
                          .map((sev) => {
                            const option = severityOptions.find((opt) => opt.value === sev)
                            return option?.label
                          })
                          .join(", ")}
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="font-medium">Notificações: </span>
                        <div className="flex space-x-1">
                          {rule.notificationMethods.map((method) => {
                            const option = notificationOptions.find((opt) => opt.value === method)
                            const Icon = option?.icon
                            return Icon ? <Icon key={method} className="h-4 w-4" /> : null
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch checked={rule.isActive} onCheckedChange={() => toggleRuleActive(rule.id)} />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteRule(rule.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* New Rule Form */}
        {showNewRuleForm && (
          <Card>
            <CardHeader>
              <CardTitle>Nova Regra de Alerta</CardTitle>
              <CardDescription>Configure uma nova regra para receber alertas personalizados</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rule-name">Nome da Regra</Label>
                  <Input
                    id="rule-name"
                    placeholder="Ex: Alertas São Paulo"
                    value={newRule.name}
                    onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rule-location">Localização</Label>
                  <Input
                    id="rule-location"
                    placeholder="Ex: São Paulo, Brasil"
                    value={newRule.location}
                    onChange={(e) => setNewRule({ ...newRule, location: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tipos de Desastre</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {disasterTypeOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`disaster-${option.value}`}
                        checked={newRule.disasterTypes.includes(option.value)}
                        onChange={() =>
                          toggleArrayValue(newRule.disasterTypes, option.value, (arr) =>
                            setNewRule({ ...newRule, disasterTypes: arr }),
                          )
                        }
                        className="rounded"
                      />
                      <Label htmlFor={`disaster-${option.value}`} className="text-sm">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Níveis de Severidade</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {severityOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`severity-${option.value}`}
                        checked={newRule.severity.includes(option.value)}
                        onChange={() =>
                          toggleArrayValue(newRule.severity, option.value, (arr) =>
                            setNewRule({ ...newRule, severity: arr }),
                          )
                        }
                        className="rounded"
                      />
                      <Label htmlFor={`severity-${option.value}`} className="text-sm">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Métodos de Notificação</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {notificationOptions.map((option) => {
                    const Icon = option.icon
                    return (
                      <div key={option.value} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`notification-${option.value}`}
                          checked={newRule.notificationMethods.includes(option.value)}
                          onChange={() =>
                            toggleArrayValue(newRule.notificationMethods, option.value, (arr) =>
                              setNewRule({ ...newRule, notificationMethods: arr }),
                            )
                          }
                          className="rounded"
                        />
                        <Label htmlFor={`notification-${option.value}`} className="text-sm flex items-center space-x-1">
                          <Icon className="h-4 w-4" />
                          <span>{option.label}</span>
                        </Label>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowNewRuleForm(false)}>
                  Cancelar
                </Button>
                <Button onClick={addNewRule}>Criar Regra</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
