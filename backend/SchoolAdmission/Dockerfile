
# Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build

WORKDIR /src

# Copy project file and restore dependencies
COPY ["SchoolAdmission.csproj", "./"]
RUN dotnet restore "SchoolAdmission.csproj"

# Copy source code and publish
COPY . .
RUN dotnet publish "SchoolAdmission.csproj" \
    -c Release \
    -o /app/publish \
    --no-restore

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final

WORKDIR /app

COPY --from=build /app/publish .

ENV ASPNETCORE_HTTP_PORTS=8080

EXPOSE 8080

ENTRYPOINT ["dotnet", "SchoolAdmission.dll"]
