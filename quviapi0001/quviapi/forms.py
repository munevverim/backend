from django import forms

class EmailForm(forms.Form):
    email_subject = forms.CharField(max_length=255, label='Email Subject')
    email_template = forms.FileField(label='Select Email Template')