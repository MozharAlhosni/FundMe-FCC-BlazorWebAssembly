using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;
using System.Text.Json;

namespace FundMeFrontEnd.Pages
{
    public class MetaMaskBase : ComponentBase
    {
        public string? etherBalance { get; set; }
        
        private IJSObjectReference? module;
        
        public ElementReference isMetaMaskConnected; 
        
        public ElementReference etherAmount;

        public string? userAddress { get; set; }

        [Inject]
        private IJSRuntime? JS { get; set; }
        
        protected override async Task OnAfterRenderAsync(bool firstRender)
        {
            if (firstRender)
            {
                // We import the JS module so that we don't pollute index.html with so many files loading at once
                module = await JS.InvokeAsync<IJSObjectReference>("import", "./js/MetaMaskFunctions.js");
            }
        }
        
        public async Task connect()
        {
            try
            {
                JsonElement[] returnObjects = await module.InvokeAsync<JsonElement[]>("connect");
                if (returnObjects[0].GetBoolean())
                {
                    // Console.WriteLine in Blazor is similar to console.Log in JS
                    Console.WriteLine("Success from the JS Function!");

                    // This usage is against the best practices
                    await module.InvokeVoidAsync("SetElementText", isMetaMaskConnected, "You have connected successfully to MetaMask");
                    userAddress = returnObjects[1][0].GetString();
                }
                else
                {
                    Console.WriteLine("Failure from the JS Function!");
                    await module.InvokeVoidAsync("SetElementText", isMetaMaskConnected, "There was a problem connecting to MetaMask");
                }
            }
            catch (Exception)
            {
                Console.WriteLine("Unhandled Error!");
                throw;
            }
        }

        public async Task balance()
        {
            etherBalance = await module.InvokeAsync<string>("balance");
        }

        public async Task fund()
        {
            await module.InvokeVoidAsync("fund", etherAmount);
        }

        public async Task withdraw()
        {
            await module.InvokeVoidAsync("withdraw");
        }
    }
}